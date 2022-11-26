interface InputType {
  type?: string;
  unionEvnets?: string[];
  selfUnion?: any;
  $input?: any;
  ref?: any;
  [propName: string]: any;
}

interface ItemType {
  name?: string;
  $input?: InputType | InputType[]; // 表单属性
  children?: InputType[];
  [propName: string]: any; // Form.Item的相关属性
}

interface ListType {
  name: string;
  [propName: string]: any; // Form.Item的相关属性
}

interface FormType {
  data: ItemType[];
  [propName: string]: any;
}

type SelectActionType = {
  id: string;
  action: any;
};

type OptionsType = {
  label: string;
  value: string | number;
  [propName: string]: any;
};
