import { createSlice } from '@reduxjs/toolkit';

export const layoutSlice = createSlice({
  name: 'layout',
  initialState: {
    TableName: '',
    TableSelection: true,
    TableFavorite: false,
    JsonData: [],
    TableData: [],
    CurrentItem: null,
    Settings: {
      SearchIndex: 0,
      SearchTblidx: '',
      DuplicateTblidx: '',
      Filter: {
        Filters: [],
        Show: false,
      },
      BulkEdit: {
        Show: false,
        FromTblidx: '',
        ToTblidx: '',
        Table: '',
        Value: '',
      },
      BulkDuplicate: {
        Show: false,
        BaseTblidx: '',
        FromTblidx: '',
        ToTblidx: '',
      },
    },
  },
  reducers: {
    setTableName(state, { payload }) {
      state.TableName = payload;
    },
    setTableSelection(state, { payload }) {
      state.TableSelection = payload;
    },
    setTableFavorite(state, { payload }) {
      state.TableFavorite = payload;
    },
    setJsonData(state, { payload }) {
      state.JsonData = payload;
    },
    setTableData(state, { payload }) {
      state.TableData = payload;
    },
    setCurrentItem(state, { payload }) {
      state.CurrentItem = payload;
    },
    setSearch(state, { payload }) {
      state.Settings.SearchIndex = payload;
    },
    setSearchTblidx(state, { payload }) {
      state.Settings.SearchTblidx = payload;
    },
    setDuplicateTblidx(state, { payload }) {
      state.Settings.DuplicateTblidx = payload;
    },
    setFilterData(state, { payload }) {
      state.Settings.Filter.Filters = payload;
    },
    setFilterShow(state, { payload }) {
      state.Settings.Filter.Show = payload;
    },
    setBulkEdit(state, { payload }) {
      state.Settings.BulkEdit = { ...state.Settings.BulkEdit, ...payload };
    },
    setBulkDuplicate(state, { payload }) {
      state.Settings.BulkDuplicate = {
        ...state.Settings.BulkDuplicate,
        ...payload,
      };
    },
  },
});

export const {
  setTableName,
  setTableSelection,
  setTableFavorite,
  setJsonData,
  setTableData,
  setCurrentItem,
  setSearch,
  setSearchTblidx,
  setDuplicateTblidx,
  setFilterData,
  setFilterShow,
  setBulkEdit,
  setBulkDuplicate,
} = layoutSlice.actions;

export default layoutSlice.reducer;
