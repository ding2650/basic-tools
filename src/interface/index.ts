export enum SupportType {
  TEXT = 'text',
  IMAGE = 'image',
}
export enum ActionType {
  CopyItem = 'COPY_ITEM',
  InitList = 'INIT_LIST',
  InitPoetry = 'INIT_POETRY',
  Hide = 'HIDE',
}

export enum IpcMainEvents {
  Cliboard = 'CLIBOARD',
  UpdatePoetry = 'UPDATE_POETRY',
}

type TodoType = any;
export interface ICopyValProps {
  type: SupportType;
  value: TodoType;
  size?: {
    width: number;
    height: number;
  };
  weight?: number;
  // temp url
  url?: string;
  date?: string;
  from?: string;
  fromIcon?: TodoType;
}

export interface ChannelProps {
  actionType: ActionType;
  payload: ICopyValProps;
}
