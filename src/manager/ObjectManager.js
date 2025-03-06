/* eslint-disable react/prop-types */
/* eslint-disable no-console */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Switch from 'react-switch';
import { cloneDeep } from 'lodash';
import {
  setTableName,
  setTableSelection,
  setTableData,
  setTableFavorite,
  setJsonData,
} from '../redux/slice';
import { LoadTable } from './TableManager';
// import { config } from './ConfigManager';
import '@fortawesome/fontawesome-free/css/all.min.css';

const { ipcRenderer } = window.electron;
// const originalData = JSON.parse(
//   await ipcRenderer.invoke('read-file', './tables.json'),
// );
const originalData = JSON.parse(
  ipcRenderer.sendSync('read-file-sync', './tables.json'),
);

// eslint-disable-next-line prefer-const
let data = cloneDeep(originalData);

const UpdateObject = () => {
  ipcRenderer.send('write-file-sync', {
    path: `./tables.json`,
    data: JSON.stringify(data, null, 2),
  });
};

function ToggleSwitch({ checked, onChange }) {
  return <Switch onColor="#e087ba" checked={checked} onChange={onChange} />;
}

const GetColumns = (states, dispatch) => {
  const handleToggleDisplay = (columnName, subKey = null) => {
    if (subKey) {
      data = {
        ...data,
        [states.TableName]: {
          ...data[states.TableName],
          columns: {
            ...data[states.TableName].columns,
            [columnName]: {
              ...data[states.TableName].columns[columnName],
              DATA: {
                ...data[states.TableName].columns[columnName].DATA,
                [subKey]: {
                  ...data[states.TableName].columns[columnName].DATA[subKey],
                  display:
                    !data[states.TableName].columns[columnName].DATA[subKey]
                      .display,
                },
              },
            },
          },
        },
      };
    } else {
      data = {
        ...data,
        [states.TableName]: {
          ...data[states.TableName],
          columns: {
            ...data[states.TableName].columns,
            [columnName]: {
              ...data[states.TableName].columns[columnName],
              display: !data[states.TableName].columns[columnName].display,
            },
          },
        },
      };
    }

    dispatch(setJsonData(data));
    UpdateObject();
  };

  return Object.entries(data[states.TableName].columns).map(
    ([columnName, columnVal]) => (
      <div
        key={`table-${states.TableName}-${columnName}`}
        className={`flex ${
          columnName.startsWith('LOOP') ? 'flex-col' : 'flex-row items-center'
        }`}
      >
        <span className="text-slate-400 font-bold text-md w-2/4">
          {columnName}
        </span>
        {columnName.startsWith('LOOP') ? (
          Object.entries(columnVal).map(([key, val]) => (
            <div
              key={`${states.TableName}-${columnName}-${key}`}
              className={`flex ${key === 'NUM' ? 'flex-row' : 'flex-col'}`}
            >
              <span className="text-slate-400 font-bold text-md w-2/4 ml-5">
                {key}
              </span>
              {key === 'NUM' ? (
                <span className="font-bold text-md">{val}</span>
              ) : (
                Object.entries(val).map(([subKey, subVal]) => (
                  <div
                    key={`${states.TableName}-${columnName}-${key}-${subKey}`}
                    className="flex flex-row mt-1"
                  >
                    <span className="text-slate-400 font-bold text-md ml-10 w-2/4">
                      {subKey}
                    </span>
                    <ToggleSwitch
                      checked={subVal.display}
                      onChange={() => handleToggleDisplay(columnName, subKey)}
                    />
                  </div>
                ))
              )}
            </div>
          ))
        ) : (
          <ToggleSwitch
            checked={columnVal.display}
            onChange={() => handleToggleDisplay(columnName)}
          />
        )}
      </div>
    ),
  );
};

const GetColumnData = (states) => {
  const arr = [];
  Object.entries(data[states.TableName].columns).forEach(([key, val]) => {
    if (key.startsWith('LOOP')) {
      for (let num = 0; num < val.NUM; num += 1) {
        for (
          let index = 0;
          index < Object.entries(val.DATA).length;
          index += 1
        ) {
          arr.push({
            table: Object.keys(val.DATA)[index],
            display: Object.values(val.DATA)[index].display,
            options: Object.values(val.DATA)[index].options,
            related: Object.values(val.DATA)[index].related,
            loop: num,
          });
        }
      }
    } else {
      arr.push({
        table: key,
        display: val.display,
        options: val.options,
        related: val.related,
      });
    }
  });
  return arr;
};

export default function DisplayTableSelection() {
  const dispatch = useDispatch();
  const states = useSelector((state) => state.layout);
  const [tab, setTab] = useState(0);

  return (
    <div
      className={`grid grid-cols-3 gap-4 w-screen ${states.TableSelection ? '' : 'hidden'}`}
    >
      <div className="space-y-2">
        <div className="grid grid-cols-2 items-center">
          <span className="font-bold text-xl">
            Tables: {Object.keys(data).length}
          </span>
          <button
            type="button"
            onClick={async () => [
              dispatch(setTableSelection(false)),
              dispatch(
                setTableData(
                  await LoadTable(GetColumnData(states), states.TableName),
                ),
              ),
            ]}
            className={`${states.TableName ? '' : 'hidden'} btn-primary px-5 py-2 font-bold bg-line border-b-2 border-foreground hover:border-pink my-auto ml-5 hover:-translate-y-1`}
          >
            Select Table
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => setTab(0)}
            className={`${tab === 0 && 'border-b-2 text-pink'} btn-primary px-5 py-2 font-bold bg-line hover:border-b-2 hover:-translate-y-1 text-center`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setTab(1)}
            className={`${tab === 1 && 'border-b-2 text-pink'} btn-primary px-5 py-2 font-bold bg-line hover:border-b-2 hover:-translate-y-1`}
          >
            Favorite
          </button>
        </div>
        <hr className="border-line" />
        <div className="flex flex-col space-y-1 overflow-scroll h-screen pb-[200px]">
          {Object.entries(data)
            .filter((e) => (tab === 1 ? e[1].favorite : true))
            .map((table) =>
              Object.entries(data[table[0]]).map(
                ([key, val]) =>
                  key === 'name' && (
                    <button
                      type="button"
                      key={`table-${table[0]}`}
                      onClick={() => [
                        dispatch(setTableName(table[0])),
                        dispatch(setTableFavorite(data[table[0]].favorite)),
                        dispatch(setJsonData(data)),
                      ]}
                      className={`${states.TableName === table[0] ? 'border-l-4 text-pink' : 'text-slate-400'} btn-primary w-full p-3 flex font-bold bg-line hover:border-l-4 hover:translate-x-2`}
                    >
                      {val}
                    </button>
                  ),
              ),
            )}
        </div>
      </div>
      <div className="flex flex-col space-y-5 overflow-scroll h-screen pb-[100px] col-span-2">
        <div className="flex flex-row items-center">
          <span className="font-bold text-xl w-2/4">Selected Table:</span>
          <span className="font-bold text-xl">{states.TableName}</span>
          {states.TableName && (
            <button
              type="button"
              onClick={() => {
                dispatch(setTableFavorite(!states.TableFavorite));
                data = {
                  ...data,
                  [states.TableName]: {
                    ...data[states.TableName],
                    favorite: !states.TableFavorite,
                  },
                };
                // (data[states.TableName].favorite = !states.TableFavorite);
                UpdateObject();
              }}
              className={`${states.TableFavorite ? 'text-red' : 'text-line'} hover:text-red hover:bg-line p-1 rounded transition-colors duration-150 text-2xl ml-5`}
              aria-label="Toggle favorite"
            >
              <i className="fas fa-heart" />
            </button>
          )}
        </div>
        {states.TableName && GetColumns(states, dispatch)}
      </div>
    </div>
  );
}
