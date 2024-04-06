import { ReducerWithoutAction } from "react";

const initialState: IState = {
  loading: false,
  flashMessage: {
    type: "",
    header: "",
    body: "",
    flashDuration: 0,
  },
  user: {
    uid: "",
    profile: {
      picture: "",
      name: "",
    },
  },
  uploadingVideo: false,
  uploadsByID: {},
  uploads: {
    pending: [],
    approved: [],
  },
};

interface IUpload {
  id: string;
  status: string;
}

interface IUploads {
  pending: IUpload[];
  approved: IUpload[];
}
export interface IState {
  loading: boolean;
  flashMessage: Partial<{
    type: string;
    header: string;
    body: string;
    flashDuration: number;
  }>;
  user: Partial<{
    uid: string;
    profile: {
      name: string;
      picture: string;
    };
  }>;
  uploadingVideo: boolean;
  uploadsByID: {
    [key: string]: IUpload;
  };
  uploads: IUploads;
}

type Action =
  | { type: "RECEIVED_AUTH"; data: any }
  | { type: "RECEIVED_LOGOUT" }
  | { type: "REQUESTING_VIDEOS" }
  | { type: "RECEIVED_VIDEOS"; data: any }
  | { type: "REQUESTING_UPLOAD_VIDEO" }
  | { type: "UPLOAD_VIDEO_SUCCESS"; data: any }
  | { type: "UPLOAD_VIDEO_FAILURE"; data: any }
  | { type: "REQUESTING_DELETE_VIDEO" }
  | { type: "RECEIVED_DELETE_VIDEO"; data: any }
  | { type: "DELETE_VIDEO_FAILED"; data: any }
  | { type: "CLEAR_FLASH_MESSAGE" };

const groupByStatus = (uploads: IState["uploadsByID"]): IUploads => {
  console.log("got uploads!!", uploads);
  return Object.values(uploads).reduce(
    (r, v) => {
      r[v.status] ||= [];
      r[v.status].push(v);
      return r;
    },
    { pending: [], approved: [] }
  ); // Fix: Provide initial value matching the shape of IUploads
};

const reducer = (state: IState, action: Action): IState => {
  switch (action.type) {
    case "RECEIVED_AUTH": {
      return {
        ...state,
        ...{
          user: {
            ...action.data,
            profile: JSON.parse(action.data.profile),
          },
        },
      };
    }
    case "RECEIVED_LOGOUT": {
      return {
        ...state,
        user: {},
      };
    }
    case "REQUESTING_VIDEOS": {
      return {
        ...state,
        loading: true,
      };
    }
    case "RECEIVED_VIDEOS": {
      const byID = action.data.reduce((r, v) => {
        r[v.id] = v;
        return r;
      }, {});

      return {
        ...state,
        loading: false,
        uploadsByID: byID,
        uploads: groupByStatus(byID),
      };
    }
    case "REQUESTING_UPLOAD_VIDEO": {
      return {
        ...state,
        uploadingVideo: true,
      };
    }
    case "UPLOAD_VIDEO_SUCCESS": {
      const uploadsByID = {
        ...state.uploadsByID,
        [action.data.video.id]: action.data.video,
      };

      return {
        ...state,
        flashMessage: action.data.flashMessage,
        uploadingVideo: false,
        uploadsByID,
        uploads: groupByStatus(uploadsByID),
      };
    }
    case "UPLOAD_VIDEO_FAILURE": {
      return {
        ...state,
        flashMessage: action.data.flashMessage,
      };
    }
    case "REQUESTING_DELETE_VIDEO": {
      return {
        ...state,
        loading: true,
      };
    }
    case "RECEIVED_DELETE_VIDEO": {
      const uploadsByID = Object.values(state.uploadsByID).reduce(
        (r, u) => {
          if (u.id === action.data.id) return r;

          r[u.id] = u;
          return r;
        },
        {} as IState["uploadsByID"]
      );

      return {
        ...state,
        loading: false,
        uploadsByID,
        uploads: groupByStatus(uploadsByID),
      };
    }
    case "DELETE_VIDEO_FAILED": {
      return {
        ...state,
        loading: false,
        flashMessage: {
          type: "failure",
          header: "Delete video failed",
          body: `Error deleting video: ${action.data.error}`,
          flashDuration: 5000,
        },
      };
    }
    case "CLEAR_FLASH_MESSAGE": {
      return {
        ...state,
        flashMessage: {},
      };
    }
    default: {
      return state;
    }
  }
};

export { initialState, reducer };
