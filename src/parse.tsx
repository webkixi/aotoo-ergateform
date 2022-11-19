import * as React from 'react';
import attrUnion from './attrUnion';
import InputUnitElement from './inputUnit';

export function adapterItemConfig(
  current: ItemType,
  data: ItemType[],
  index?: number[]
): any {
  let directUnions: any[] = [];
  let flatFormNames: any[] = [];
  let flatChilds: any[] = [];
  if (current.name && current.type !== 'direct-union-callback') {
    flatFormNames.push(current.name);
    if (index) {
      flatChilds.push({
        name: current.name,
        path: index,
      });
    }
  }
  if (current['$input']) {
    if (Array.isArray(current['$input'])) {
      current['$input'] = current['$input'].map((subItem, jj) => {
        const _key =
          subItem.key || (subItem.name || '') + current.key + '_' + jj;
        if (React.isValidElement(subItem)) {
          return React.cloneElement(subItem, { key: _key });
        } else {
          subItem.key = _key;
          const res = adapterItemConfig(
            subItem,
            data,
            index ? [...index, jj] : undefined
          );
          directUnions = directUnions.concat(res.directUnions);
          flatFormNames = flatFormNames.concat(res.flatFormNames);
          flatChilds = flatChilds.concat(res.flatChilds);
          return res.current;
        }
      });
    } else {
      if (current.type === 'direct-union-callback') {
        directUnions.push([
          current.event,
          current.name,
          current.directUnionCallback,
        ]);
      }
      // 处理联动关系
      data.forEach((item) => {
        let $input = item['$input'];
        let accessUnion = true;
        if (Array.isArray($input)) {
          $input.forEach(() => {
            const res = adapterItemConfig(current, $input as ItemType[]);
            return res.current;
          });
          accessUnion = false;
        }
        if (accessUnion && item.union && item.union.target === current.name) {
          current = attrUnion(current, item.union);
        }
      });
    }
    const { $input, label, name, key, union, ...restField } = current;
    let inputEle = null;
    const _key = key || name;
    if (Array.isArray($input)) {
      inputEle = $input;
    } else {
      inputEle = <InputUnitElement selfUnion={union} {...$input} />;
    }
    return {
      current: {
        label,
        name,
        inputElement: inputEle,
        key: _key,
        ...restField,
      },
      directUnions,
      flatFormNames,
      flatChilds,
    };
  }

  if (current.type === 'direct-union-callback') {
    directUnions.push([
      current.evnet,
      current.name,
      current.directUnionCallback,
    ]);
  }

  if (current.name) {
    flatFormNames.push(current.name);
  }

  return { current, directUnions, flatFormNames, flatChilds };
}

export function adapterConfig(data: ItemType[]) {
  const fields: any[] = [];
  let directUnions: any[] = [];
  let flatFormNames: any[] = []; // 扁平化所有表单的name
  let flatChilds:any[] = []; // 扁平化子元素及寻址路径
  data.forEach((item: ItemType, ii: number) => {
    const _key = (item.key || item.name || '') + '_' + ii;
    if (React.isValidElement(item)) {
      const jsx = React.cloneElement(item, { key: _key });
      fields.push(jsx);
    } else {
      item.key = _key;
      const result = adapterItemConfig(item, data, [ii]);
      directUnions = [...directUnions, ...result.directUnions];
      flatFormNames = [...flatFormNames, ...result.flatFormNames];
      flatChilds = [...flatChilds, ...result.flatChilds];
      fields.push(result.current);
    }
  });
  return {
    fields,
    directUnions,
    flatFormNames,
    flatChilds,
  };
}
