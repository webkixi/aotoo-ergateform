interface InputType {
  type?: string;
  unionEvnets?: string[];
  selfUnion?: any;
  $input?: any;
  ref?: any;
  [propName: string]: any;
}

declare function IgetForm(): any

type thisContext = {
  getForm: typeof IgetForm;
  [propName: string]: any;
}

declare function UnionCallback(
  this: thisContext, 
  value
) : any

interface ItemType {
  name?: string;
  $input?: InputType | InputType[]; // 表单属性
  children?: InputType[];
  union?: {
    target: string;
    event: string;
    callback: typeof UnionCallback
  }
  [propName: string]: any; // Form.Item的相关属性
}

interface ListType {
  prefixCls?: string;
  name: string | number | (string | number)[];
  rules?: ValidatorRule[];
  initialValue?: any[];
}

declare function FormDataFunctionType<T extends object, S>(
  state: any,
  setState: (param: object) => void
): ItemType[]

interface FormType {
  data: ItemType[] | typeof FormDataFunctionType;
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


declare function IrenderCallback(
  fields: FormListFieldData[],
  params: FormListOperation,
  errors: any
): JSX.Element

declare function Irender(
  callback: typeof IrenderCallback
): JSX.Element

const Form: any;
declare function union(target: string, callback: typeof UnionCallback): any;
declare function formItem<P extends ItemType>(param: P): React.ReactNode
declare function formList<P extends ListType>(
  params: P
): {
  render: typeof Irender
};

// declare const ErgateForm: React.FC<{ state: object }, FormProps>
declare const ErgateForm: <Values = any>(props: FormProps<Values> & {
  data: ItemType[] | typeof FormDataFunctionType,
  state?: object,
  children?: React.ReactNode;
} & {
  ref?: React.Ref<FormInstance<Values>> | undefined;
}) => React.ReactElement;

