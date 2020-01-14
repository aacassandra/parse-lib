import { ParseLQ } from '@aacassandra/parse-live-query';
import Config from './functions/config';
import Objects from './functions/objects';
import Session from './functions/session';
import Users from './functions/users';
import Queries from './functions/queries';
import Roles from './functions/roles';

const ParseConfig = Config;

const ParseRetrieve = Objects.retrieve;
const ParseRetrieves = Objects.retrieves;
const ParseSave = Objects.save;
const ParseUpdate = Objects.update;
const ParseDelete = Objects.delete;
const ParseBatch = Objects.batch;

const ParseSignIn = Users.signIn;
const ParseSignUp = Users.signUp;
const ParseSignOut = Users.signOut;
const ParseValidateSession = Users.validateSession;
const ParseUpdateUser = Users.updateUser;
const ParseRetrieveUser = Users.retrieveUser;
const ParseRetrievesUser = Users.retrievesUser;

const ParseRetrieveSession = Session.retrieveSession;
const ParseRetrievesSession = Session.retrievesSession;
const ParseUpdateSession = Session.updateSession;
const ParseDeleteSession = Session.deleteSession;

const ParseQueriesBasic = Queries.basic;
const ParseRetrieveRelation = Queries.retrievesRelation;
const ParseCountingObjects = Queries.countingObjects;
const ParseCreateRole = Roles.createRole;
const ParseRetrieveRole = Roles.retrieveRole;
const ParseUpdateRole = Roles.updateRole;
const ParseDeleteRole = Roles.deleteRole;

const ParseWebSocket = ParseLQ;

export {
  ParseConfig,
  ParseRetrieve,
  ParseRetrieves,
  ParseSave,
  ParseUpdate,
  ParseDelete,
  ParseBatch,
  ParseSignIn,
  ParseSignUp,
  ParseSignOut,
  ParseValidateSession,
  ParseUpdateUser,
  ParseRetrieveUser,
  ParseRetrievesUser,
  ParseRetrieveSession,
  ParseRetrievesSession,
  ParseUpdateSession,
  ParseDeleteSession,
  ParseQueriesBasic,
  ParseRetrieveRelation,
  ParseCountingObjects,
  ParseCreateRole,
  ParseRetrieveRole,
  ParseUpdateRole,
  ParseDeleteRole,
  ParseWebSocket
};
