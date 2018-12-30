import { OPEN_NOTIFICATION, CLOSE_NOTIFICATION } from '../actionType/NotificationType';

const notificationInit = {
  open: false,
  message: ''
};

export default function NotificationReducer(state = notificationInit, action) {
  switch (action.type) {
    case OPEN_NOTIFICATION:
      return { ...action.payload };
    case CLOSE_NOTIFICATION:
      return { ...state, open: false };
    default:
      return state;
  }
}

