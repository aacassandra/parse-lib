import Config from './functions/config';
import Objects from './functions/objects';
import Session from './functions/session';
import Users from './functions/users';
import Queries from './functions/queries';
import Roles from './functions/roles';
import File from './functions/files';
import Cloud from './functions/cloud';
import LiveQuery from './functions/liveQuery';

const ParseConfig = Config;

// Object
const ParseCreateObject = Objects.creatingObject;
const ParseRetrieveObject = Objects.retrieveObject;
const ParseUpdateObject = Objects.updateObject;
const ParseDeleteObject = Objects.deleteObject;
const ParseBatch = Objects.batch;

// Queries
const ParseRetrieveObjects = Queries.basic;
const ParseRetrieveRelation = Queries.retrievesRelation;
const ParseCountingObjects = Queries.countingObjects;

// Users
const ParseSignIn = Users.signIn;
const ParseSignUp = Users.signUp;
const ParseSignOut = Users.signOut;
// const ParseVerifyingEmail = Users.verivy;
// const ParseResettingPassword = Users.resetPassword;
const ParseValidateSession = Users.validateSession;
const ParseUpdateUser = Users.updateUser;
const ParseRetrieveUser = Users.retrieveUser;
const ParseRetrieveUsers = Users.retrieveUsers;
const ParseDeleteUser = Users.deleteUser;

// Sessions
// const ParseCreateSession = Session.createSession;
const ParseRetrieveSession = Session.retrieveSession;
const ParseRetrievesSession = Session.retrievesSession;
const ParseUpdateSession = Session.updateSession;
const ParseDeleteSession = Session.deleteSession;

// Roles
const ParseCreateRole = Roles.createRole;
const ParseRetrieveRole = Roles.retrieveRole;
const ParseUpdateRole = Roles.updateRole;
const ParseDeleteRole = Roles.deleteRole;

// Files
const ParseUploadFile = File.upload;
const ParseDeleteFile = File.delete;

// Cloud Code
const ParseCloud = Cloud;

// Live Query
const ParseLiveQuery = LiveQuery;

export {
  ParseConfig,
  //--------------------------
  // ---Object
  ParseCreateObject,
  ParseRetrieveObject,
  ParseUpdateObject,
  ParseDeleteObject,
  ParseBatch,
  //--------------------------
  // ---Queries
  ParseRetrieveObjects,
  ParseRetrieveRelation,
  ParseCountingObjects,
  //--------------------------
  // ---Users
  ParseSignIn,
  ParseSignUp,
  ParseSignOut,
  // ParseVerifyingEmail,
  // ParseResettingPassword,
  ParseValidateSession,
  ParseUpdateUser,
  ParseRetrieveUser,
  ParseRetrieveUsers,
  ParseDeleteUser,
  //--------------------------
  // ---Session
  // ParseCreateSession,
  ParseRetrieveSession,
  ParseUpdateSession,
  ParseDeleteSession,
  ParseRetrievesSession,
  //--------------------------
  // ---Roles
  ParseCreateRole,
  ParseRetrieveRole,
  ParseUpdateRole,
  ParseDeleteRole,
  //--------------------------
  // ---Files
  ParseUploadFile,
  ParseDeleteFile,
  //--------------------------
  // ---Cloud COde
  ParseCloud,
  //--------------------------
  // ---Live Query
  ParseLiveQuery
};
