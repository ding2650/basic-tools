export enum SupportType {
  TEXT = 'text',
  IMAGE = 'image',
}
export enum ActionType {
  AddCard = 'ADD_CARD',
  EditCard = 'EDIT_CARD',
  DeleteCard = 'DELETE_CARD',
  CopyItem = 'COPY_ITEM',
  InitList = 'INIT_LIST',
  InitPoetry = 'INIT_POETRY',
  Hide = 'HIDE',
}

export enum IpcMainEvents {
  Cliboard = 'CLIBOARD',
  Card = 'CARD',
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

export interface CopyCardProps {
  alias: string;
  value: string;
  updateDate?: string;
}
