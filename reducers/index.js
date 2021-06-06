import { combineReducers } from 'redux';
import expanded from './expandedReducer';
import activeTab from './activeTabReducer';
import email from './emailReducer';
import myPermission from './myPermissionReducer';
import participantState from './participantStateReducer';
import letter from './letterReducer';
import username from './usernameReducer';
import sidebarVisibility from './sidebarVisibilityReducer';
import burgerIconVisibility from './burgerIconVisibilityReducer';
import burgerIcon from './burgerIconReducer';

const allReducers = combineReducers({
  expanded,
  activeTab,
  sidebarVisibility,
  email,
  myPermission,
  participantState,
  letter,
  username,
  burgerIcon,
  burgerIconVisibility
});

export default allReducers;