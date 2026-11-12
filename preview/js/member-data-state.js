const DEFAULT_SEARCH_FIELDS = Object.freeze([
  'name',
  'identity',
  'phone',
  'landline',
  'email',
  'address',
  'remark'
]);

const FILTER_KEYS = new Set([
  'query',
  'enabled',
  'locked',
  'fields',
  'predicate',
  'searchFields'
]);

function cloneRecord(record) {
  return {
    ...record,
    category: Array.isArray(record.category)
      ? [...record.category]
      : record.category
  };
}

function normalizePositiveInteger(value, name) {
  if (!Number.isInteger(value) || value <= 0) {
    throw new TypeError(`${name} must be a positive integer`);
  }

  return value;
}

function normalizeEnabledFilter(value) {
  if (value === null || value === 'all') return null;
  if (value === true || value === 'enabled') return true;
  if (value === false || value === 'disabled') return false;
  throw new TypeError('enabled filter must be all, enabled, disabled, true, false, or null');
}

function normalizeLockedFilter(value) {
  if (value === null || value === 'all') return null;
  if (value === true || value === 'locked') return true;
  if (value === false || value === 'unlocked') return false;
  throw new TypeError('locked filter must be all, locked, unlocked, true, false, or null');
}

function valuesEqual(left, right) {
  if (Object.is(left, right)) return true;

  if (Array.isArray(left) && Array.isArray(right)) {
    return left.length === right.length
      && left.every((value, index) => valuesEqual(value, right[index]));
  }

  return false;
}

function cloneFieldFilters(fields) {
  return Object.fromEntries(
    Object.entries(fields).map(([field, value]) => [
      field,
      Array.isArray(value) ? [...value] : value
    ])
  );
}

function compareValues(left, right) {
  if (Object.is(left, right)) return 0;
  if (left == null) return -1;
  if (right == null) return 1;

  if (Array.isArray(left) && Array.isArray(right)) {
    const length = Math.min(left.length, right.length);
    for (let index = 0; index < length; index += 1) {
      const result = compareValues(left[index], right[index]);
      if (result !== 0) return result;
    }
    return left.length < right.length ? -1 : left.length > right.length ? 1 : 0;
  }

  if (typeof left === 'number' && typeof right === 'number') {
    return left < right ? -1 : left > right ? 1 : 0;
  }

  if (typeof left === 'boolean' && typeof right === 'boolean') {
    return left === right ? 0 : left ? 1 : -1;
  }

  const leftText = String(left);
  const rightText = String(right);
  return leftText < rightText ? -1 : leftText > rightText ? 1 : 0;
}

function normalizeDirection(direction) {
  if (direction !== 'asc' && direction !== 'desc') {
    throw new TypeError('sort direction must be asc or desc');
  }

  return direction;
}

/**
 * Pure state for member rows, filtering, sorting, pagination, and batch lock selection.
 * Records require a unique id and independent boolean enabled and locked fields.
 */
export class MemberDataState {
  constructor(records, options = {}) {
    if (!Array.isArray(records)) {
      throw new TypeError('records must be an array');
    }

    this._records = [];
    this._recordsById = new Map();
    records.forEach((record, index) => {
      if (!record || typeof record !== 'object') {
        throw new TypeError(`record at index ${index} must be an object`);
      }
      if (record.id === undefined || record.id === null) {
        throw new TypeError(`record at index ${index} must have a stable id`);
      }
      if (typeof record.enabled !== 'boolean' || typeof record.locked !== 'boolean') {
        throw new TypeError(`record ${String(record.id)} must have boolean enabled and locked fields`);
      }
      if (this._recordsById.has(record.id)) {
        throw new TypeError(`duplicate record id: ${String(record.id)}`);
      }

      const copy = cloneRecord(record);
      this._records.push(copy);
      this._recordsById.set(copy.id, copy);
    });

    this._batchMode = false;
    this._selectedIds = new Set();
    this._sort = null;
    this._pageSize = normalizePositiveInteger(options.pageSize ?? 5, 'pageSize');
    this._displayMode = options.displayMode ?? 'all';
    if (this._displayMode !== 'all' && this._displayMode !== 'paged') {
      throw new TypeError('displayMode must be all or paged');
    }
    this._pageIndex = 0;
    this._filters = {
      query: '',
      enabled: true,
      locked: null,
      fields: {},
      predicate: null,
      searchFields: [...DEFAULT_SEARCH_FIELDS]
    };

    if (options.filters !== undefined) {
      this.setFilters(options.filters);
    }
  }

  enterBatchMode() {
    this._batchMode = true;
    return this._batchMode;
  }

  endBatchMode() {
    this._selectedIds.clear();
    this._batchMode = false;
    return this._batchMode;
  }

  isBatchMode() {
    return this._batchMode;
  }

  clearSelection() {
    const clearedCount = this._selectedIds.size;
    this._selectedIds.clear();
    return clearedCount;
  }

  getSelectedIds() {
    return [...this._selectedIds];
  }

  getSelectedCount() {
    return this._selectedIds.size;
  }

  getSelectedRows() {
    return [...this._selectedIds]
      .map((id) => this._recordsById.get(id))
      .filter(Boolean)
      .map(cloneRecord);
  }

  isSelected(id) {
    return this._selectedIds.has(id);
  }

  canSelect(id) {
    return this._batchMode && this._recordsById.has(id);
  }

  setSelected(id, selected) {
    if (!this.canSelect(id) || typeof selected !== 'boolean') return false;
    if (selected) this._selectedIds.add(id);
    else this._selectedIds.delete(id);
    return true;
  }

  toggleSelection(id) {
    if (!this.canSelect(id)) return null;
    const selected = !this._selectedIds.has(id);
    this.setSelected(id, selected);
    return selected;
  }

  selectAllFiltered() {
    if (!this._batchMode) return 0;
    let addedCount = 0;
    for (const record of this._getFilteredRecords()) {
      if (!this._selectedIds.has(record.id)) {
        this._selectedIds.add(record.id);
        addedCount += 1;
      }
    }
    return addedCount;
  }

  deselectAllFiltered() {
    if (!this._batchMode) return 0;
    let removedCount = 0;
    for (const record of this._getFilteredRecords()) {
      if (this._selectedIds.delete(record.id)) removedCount += 1;
    }
    return removedCount;
  }

  toggleSelectAllFiltered() {
    if (!this._batchMode) return null;
    if (this.getHeaderSelectionState() === 'checked') {
      this.deselectAllFiltered();
    } else {
      this.selectAllFiltered();
    }
    return this.getHeaderSelectionState();
  }

  getHeaderSelectionState() {
    const filteredRecords = this._getFilteredRecords();
    if (filteredRecords.length === 0) return 'unchecked';

    let selectedCount = 0;
    for (const record of filteredRecords) {
      if (this._selectedIds.has(record.id)) selectedCount += 1;
    }

    if (selectedCount === 0) return 'unchecked';
    if (selectedCount === filteredRecords.length) return 'checked';
    return 'mixed';
  }

  getHeaderSelectionCounts() {
    const filteredRecords = this._getFilteredRecords();
    let selectedCount = 0;
    for (const record of filteredRecords) {
      if (this._selectedIds.has(record.id)) selectedCount += 1;
    }

    return {
      selectedCount,
      filteredCount: filteredRecords.length
    };
  }

  getEligibleCounts() {
    let lockEligibleCount = 0;
    let unlockEligibleCount = 0;

    for (const id of this._selectedIds) {
      const record = this._recordsById.get(id);
      if (!record) continue;
      if (record.locked) unlockEligibleCount += 1;
      else lockEligibleCount += 1;
    }

    return {
      selectedCount: this._selectedIds.size,
      lockEligibleCount,
      unlockEligibleCount
    };
  }

  applyBatchLock() {
    if (!this._batchMode) return 0;
    let changedCount = 0;
    for (const id of this._selectedIds) {
      const record = this._recordsById.get(id);
      if (record && !record.locked) {
        record.locked = true;
        changedCount += 1;
      }
    }
    return changedCount;
  }

  applyBatchUnlock() {
    if (!this._batchMode) return 0;
    let changedCount = 0;
    for (const id of this._selectedIds) {
      const record = this._recordsById.get(id);
      if (record && record.locked) {
        record.locked = false;
        changedCount += 1;
      }
    }
    return changedCount;
  }

  canToggleRowLock(id) {
    return !this._batchMode && this._recordsById.has(id);
  }

  toggleRowLock(id) {
    if (!this.canToggleRowLock(id)) return false;
    const record = this._recordsById.get(id);
    record.locked = !record.locked;
    return true;
  }

  canToggleEnabled(id) {
    const record = this._recordsById.get(id);
    return !this._batchMode && Boolean(record) && !record.locked;
  }

  toggleEnabled(id) {
    if (!this.canToggleEnabled(id)) return false;
    const record = this._recordsById.get(id);
    record.enabled = !record.enabled;
    return true;
  }

  setEnabled(id, enabled) {
    if (!this.canToggleEnabled(id) || typeof enabled !== 'boolean') return false;
    this._recordsById.get(id).enabled = enabled;
    return true;
  }

  canDeletePersonalData(id) {
    const record = this._recordsById.get(id);
    return !this._batchMode && Boolean(record) && !record.locked;
  }

  getRowActionAvailability(id) {
    return {
      canToggleLock: this.canToggleRowLock(id),
      canToggleEnabled: this.canToggleEnabled(id),
      canDeletePersonalData: this.canDeletePersonalData(id)
    };
  }

  setFilters(filters = {}) {
    if (!filters || typeof filters !== 'object' || Array.isArray(filters)) {
      throw new TypeError('filters must be an object');
    }

    for (const key of Object.keys(filters)) {
      if (!FILTER_KEYS.has(key)) throw new TypeError(`unsupported filter key: ${key}`);
    }

    const next = { ...this._filters };
    if (Object.hasOwn(filters, 'query')) {
      next.query = filters.query == null ? '' : String(filters.query);
    }
    if (Object.hasOwn(filters, 'enabled')) {
      next.enabled = normalizeEnabledFilter(filters.enabled);
    }
    if (Object.hasOwn(filters, 'locked')) {
      next.locked = normalizeLockedFilter(filters.locked);
    }
    if (Object.hasOwn(filters, 'fields')) {
      if (filters.fields == null) {
        next.fields = {};
      } else if (typeof filters.fields === 'object' && !Array.isArray(filters.fields)) {
        next.fields = cloneFieldFilters(filters.fields);
      } else {
        throw new TypeError('fields filter must be an object or null');
      }
    }
    if (Object.hasOwn(filters, 'predicate')) {
      if (filters.predicate !== null && typeof filters.predicate !== 'function') {
        throw new TypeError('predicate filter must be a function or null');
      }
      next.predicate = filters.predicate;
    }
    if (Object.hasOwn(filters, 'searchFields')) {
      if (!Array.isArray(filters.searchFields)
        || filters.searchFields.some((field) => typeof field !== 'string')) {
        throw new TypeError('searchFields must be an array of field names');
      }
      next.searchFields = [...filters.searchFields];
    }

    this._filters = next;
    this.clearSelection();
    this._clampPageIndex();
    return this.getFilters();
  }

  getFilters() {
    return {
      query: this._filters.query,
      enabled: this._filters.enabled,
      locked: this._filters.locked,
      fields: cloneFieldFilters(this._filters.fields),
      predicate: this._filters.predicate,
      searchFields: [...this._filters.searchFields]
    };
  }

  getFilteredRows() {
    return this._getFilteredRecords().map(cloneRecord);
  }

  getVisibleRows() {
    const filteredRecords = this._getFilteredRecords();
    if (this._displayMode === 'all') return filteredRecords.map(cloneRecord);

    const start = this._pageIndex * this._pageSize;
    return filteredRecords.slice(start, start + this._pageSize).map(cloneRecord);
  }

  getRecord(id) {
    const record = this._recordsById.get(id);
    return record ? cloneRecord(record) : null;
  }

  getPageInfo() {
    const filteredCount = this._getFilteredRecords().length;
    const pageCount = this._displayMode === 'all'
      ? (filteredCount === 0 ? 0 : 1)
      : Math.ceil(filteredCount / this._pageSize);

    return {
      displayMode: this._displayMode,
      pageIndex: this._pageIndex,
      pageSize: this._pageSize,
      pageCount,
      filteredCount
    };
  }

  setPage(pageIndex) {
    if (!Number.isInteger(pageIndex) || pageIndex < 0) {
      throw new TypeError('pageIndex must be a non-negative integer');
    }
    if (this._displayMode === 'all') {
      this._pageIndex = 0;
      return this._pageIndex;
    }

    const pageCount = Math.ceil(this._getFilteredRecords().length / this._pageSize);
    this._pageIndex = pageCount === 0 ? 0 : Math.min(pageIndex, pageCount - 1);
    return this._pageIndex;
  }

  setPageSize(pageSize) {
    this._pageSize = normalizePositiveInteger(pageSize, 'pageSize');
    this._clampPageIndex();
    return this._pageSize;
  }

  setDisplayMode(displayMode) {
    if (displayMode !== 'all' && displayMode !== 'paged') {
      throw new TypeError('displayMode must be all or paged');
    }
    this._displayMode = displayMode;
    this._clampPageIndex();
    return this._displayMode;
  }

  sortBy(field, direction) {
    if (typeof field !== 'string' || field.length === 0) {
      throw new TypeError('sort field must be a non-empty string');
    }

    let nextDirection = direction;
    if (nextDirection === undefined) {
      if (this._sort?.field !== field) {
        nextDirection = 'asc';
      } else {
        nextDirection = this._sort.direction === 'asc' ? 'desc' : 'asc';
      }
    }

    this._sort = { field, direction: normalizeDirection(nextDirection) };
    return this.getSort();
  }

  clearSort() {
    this._sort = null;
  }

  getSort() {
    return this._sort ? { ...this._sort } : null;
  }

  _clampPageIndex() {
    if (this._displayMode === 'all') {
      this._pageIndex = 0;
      return;
    }

    const pageCount = Math.ceil(this._getFilteredRecords().length / this._pageSize);
    this._pageIndex = pageCount === 0
      ? 0
      : Math.min(this._pageIndex, pageCount - 1);
  }

  _getFilteredRecords() {
    const matchingRecords = this._records.filter((record) => this._matchesFilters(record));
    if (!this._sort) return matchingRecords;

    const direction = this._sort.direction === 'asc' ? 1 : -1;
    return matchingRecords
      .map((record, index) => ({ record, index }))
      .sort((left, right) => {
        const result = compareValues(left.record[this._sort.field], right.record[this._sort.field]);
        return result === 0 ? left.index - right.index : result * direction;
      })
      .map(({ record }) => record);
  }

  _matchesFilters(record) {
    const { query, enabled, locked, fields, predicate, searchFields } = this._filters;

    if (enabled !== null && record.enabled !== enabled) return false;
    if (locked !== null && record.locked !== locked) return false;

    if (query) {
      const normalizedQuery = query.toLowerCase();
      const matchesText = searchFields.some((field) => {
        const value = record[field];
        return value != null && String(value).toLowerCase().includes(normalizedQuery);
      });
      if (!matchesText) return false;
    }

    for (const [field, expected] of Object.entries(fields)) {
      if (!valuesEqual(record[field], expected)) return false;
    }

    return predicate ? Boolean(predicate(cloneRecord(record))) : true;
  }
}
