/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import { config } from '../manager/ConfigManager';
import { SuccessToast } from '../shared/Alerts';
import '@fortawesome/fontawesome-free/css/all.min.css';

const { ipcRenderer } = window.electron;
const data = JSON.parse(
  ipcRenderer.sendSync('read-file-sync', './tables.json'),
);

const GetColumnData = (TableName) => {
  const arr = [];
  Object.entries(data[TableName].columns).forEach(([key, val]) => {
    if (
      key === 'LOOP' ||
      key === 'LOOP2' ||
      key === 'LOOP3' ||
      key === 'LOOP4'
    ) {
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

const LoadTable = (ObjectData, TableName, Tblidx) => {
  const table = [];
  const tableObj = [];
  const filePath = `./script/${TableName}.txt`;
  const file = ipcRenderer.sendSync('read-file-sync', filePath);
  file.split('\n').forEach((item) => {
    if (item.includes('//') === false && item !== '') {
      table.push(item.split('\t'));
    }
  });
  table.forEach((row) => {
    const table2 = [];
    let rowNum = 0;
    if (row[rowNum] === Tblidx) {
      Object.entries(ObjectData).forEach(([, val]) => {
        if (
          val.table !== undefined ||
          row[rowNum] !== undefined ||
          val.display !== undefined
        ) {
          if (Array.isArray(val.table) === false) {
            if (val.loop !== undefined)
              table2.push({
                [val.table]: row[rowNum],
                display: val.display,
                options: val.options,
                related: val.related,
                loop: val.loop,
              });
            else
              table2.push({
                [val.table]: row[rowNum],
                display: val.display,
                options: val.options,
                related: val.related,
              });
            rowNum += 1;
          }
        }
      });
      tableObj.push(table2);
      return tableObj;
    }
    return {};
  });
  return tableObj;
};

const SaveTable = (CurrentItem, TableName, Tblidx) => {
  const table = [];
  const tableObj = [];
  const filePath = `./script/${TableName}.txt`;
  const file = JSON.parse(ipcRenderer.sendSync('read-file-sync', filePath));

  const item = [];
  CurrentItem.map((row) =>
    row.map((columns) =>
      Object.entries(columns)
        .filter(
          ([key]) =>
            key !== 'display' &&
            key !== 'options' &&
            key !== 'related' &&
            key !== 'loop',
        )
        .map(([, val]) => item.push(val)),
    ),
  );

  file.split('\n').forEach((line) => {
    if (line.includes('//') === false && line !== '') {
      table.push(line.split('\t'));
    }
  });
  table.forEach((row) => {
    const rowNum = 0;
    if (row[rowNum] !== Tblidx) tableObj.push(row);
    else tableObj.push(item);
  });

  const output = tableObj
    .map((row) => row.map((columns) => columns).join('\t'))
    .join('\n');

  ipcRenderer.sendSync('write-file-sync', {
    path: `./script/${TableName}.txt`,
    data: output,
  });
  SuccessToast.fire(`Saved ${TableName}.txt`);
};

function View() {
  const [state, setState] = useState({
    isLoaded: false,
    currentItem: null,
    tableName: null,
    tblidx: null,
  });

  useEffect(() => {
    const handleData = (arg) => {
      try {
        console.log('view loaded', arg);
        setState({
          isLoaded: true,
          currentItem: LoadTable(
            GetColumnData(arg.TableName[1]),
            arg.TableName[1],
            arg.Tblidx,
          ),
          tableName: arg.TableName,
          tblidx: arg.Tblidx,
        });
      } catch (error) {
        console.error('Error parsing data:', error);
      }
    };

    ipcRenderer.once('fromMainWindow', handleData);

    // Clean up the listener when component unmounts
    return () => {
      ipcRenderer.removeListener('fromMainWindow', handleData);
    };
  });

  const handleUpdate = (e, key, val, l = false) => {
    const curItem = state.currentItem;
    if (!curItem[0].length) {
      return console.error('CurrItem invalid');
    }
    let i = null;
    if (l && l >= 0) {
      i = {
        ...curItem[0].find((x) => x[key] === val && x.loop && x.loop === l),
      };
    } else {
      i = { ...curItem[0].find((x) => x[key] === val) };
    }
    if (!i) {
      return console.error('No index');
    }
    let index = null;

    if (l && l >= 0) {
      index = curItem[0].indexOf(
        curItem[0].find((x) => x[key] === i[key] && x.loop && x.loop === l),
      );
    } else {
      index = curItem[0].indexOf(curItem[0].find((x) => x[key] === i[key]));
    }

    i[key] = e.target.value;
    curItem[0][index] = { ...i };
    setState({ ...state, currentItem: [...curItem] });
    return i;
  };

  return (
    <div className="App bg-background overflow-hidden min-h-screen w-full text-pink font-bold overscroll-none p-0 m-0 border-solid border-background border-x-2">
      <div className="tabs fixed flex w-full bg-line h-[50px] select-none items-center">
        {state.tableName && (
          <span className="ml-5 font-bold text-sm text-background">
            {state.tableName[0]} {'>'} {state.tableName[1]}
          </span>
        )}
        {state.currentItem && (
          <button
            type="button"
            onClick={() =>
              SaveTable(state.currentItem, state.tableName[1], state.tblidx)
            }
            className="btn-primary w-[150px] ml-auto px-5 h-full font-bold bg-foreground hover:border-b-2 hover:-translate-y-1"
          >
            Save Table
          </button>
        )}
      </div>

      {state.isLoaded && (
        <div className="overflow-scroll h-full px-4 space-y-1 w-full pt-[65px]">
          {state.currentItem[0] &&
            Object.values(state.currentItem[0]).map((item) =>
              Object.entries(item).map(
                ([key, val]) =>
                  item.display === true &&
                  key !== 'display' &&
                  key !== 'options' &&
                  key !== 'related' &&
                  key !== 'loop' && (
                    <div
                      key={key}
                      className="w-full grid grid-cols-2 items-center gap-4"
                    >
                      <span className="text-xl ml-auto">
                        {key}
                        {data.loop >= 0 &&
                          config.ShowLoopIndex &&
                          `: ${data.loop}`}
                      </span>
                      {data.options !== false && data.options !== undefined ? (
                        <select
                          className="btn-primary p-3 w-full flex font-bold bg-line focus:text-pink focus:border-r-4 hover:border-r-4"
                          value={val}
                          onChange={(e) => {
                            handleUpdate(e, key, val);
                          }}
                        >
                          {Object.entries(data.options).map(
                            ([optKey, optVal]) => (
                              <option
                                key={optKey}
                                className="btn-primary p-3 flex font-bold bg-line focus:text-pink focus:border-r-4 hover:border-r-4"
                                value={optKey}
                              >
                                {optVal} {config.ShowOptionIndex && optKey}
                              </option>
                            ),
                          )}
                        </select>
                      ) : (
                        <div className="flex flex-row items-center space-x-2 w-full">
                          <input
                            type="text"
                            className="btn-primary p-3 flex font-bold bg-line focus:text-pink focus:border-r-4 hover:border-r-4 w-full"
                            value={val}
                            onChange={(e) => {
                              handleUpdate(
                                e,
                                key,
                                val,
                                data.loop || data.loop === 0
                                  ? data.loop
                                  : false,
                              );
                            }}
                          />
                          <span>{data.related}</span>
                          {data.related !== false ||
                            (val !== '4294967295' && (
                              <button
                                type="button"
                                onClick={() =>
                                  ipcRenderer.send('view2', {
                                    TableName: [
                                      state.tableName[0],
                                      state.tableName[1],
                                      data.related,
                                    ],
                                    Tblidx: val,
                                  })
                                }
                                aria-label="View"
                                className="hover:bg-line hover:border-b-4 border-pink py-2 px-3 rounded-lg cursor-pointer"
                              >
                                <i className="fas fa-up-right-from-square" />
                              </button>
                            ))}
                        </div>
                      )}
                    </div>
                  ),
              ),
            )}
        </div>
      )}
    </div>
  );
}

export default View;
