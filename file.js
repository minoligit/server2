const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const Roles = require('./routes/roles.js');
const Servers = require('./routes/servers.js');
const Technologies = require('./routes/technologies.js');
const Projects = require('./routes/projects.js');
const ProjectUsers = require('./routes/projectUsers.js');
const ProjectTargets = require('./routes/projectTargets');
const ProjectDayProtion = require('./routes/projectDayProtion');
const ProjectDailyWork = require('./routes/projectDailyWork');
const Directory = require('./routes/directory.js');
const NFSMountOption = require('./routes/nfsMountOpt.js');
const RoleDirMountOption = require('./routes/roleDirMountOpt.js');
const LoginSession = require('./routes/loginSessions.js');
const AssignProj = require('./routes/assignProj.js');
const Users = require('./routes/users.js');
const SessionInfo = require('./routes/sessionInfo.js');
const SysAuditLog = require('./routes/sysAuditLog.js');
const UserAlloc = require('./routes/userAlloc.js');
const WorkDayCal = require('./routes/workDayCal.js');
const UGRights = require('./routes/ugRights.js');
const UGMembers = require('./routes/ugMembers.js');
const UGGroups = require('./routes/ugGroups.js');

const Select = require('./select.js');

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors({exposedHeaders: ['Content-Range']}));
app.use('/',Roles);
app.use('/',Servers);
app.use('/',Technologies);
app.use('/',Projects);
app.use('/',ProjectUsers);
app.use('/',ProjectTargets);
app.use('/',ProjectDayProtion);
app.use('/',ProjectDailyWork);
app.use('/',Directory);
app.use('/',NFSMountOption);
app.use('/',RoleDirMountOption);
app.use('/',AssignProj);
app.use('/',LoginSession);
app.use('/',Users);
app.use('/',SessionInfo);
app.use('/',SysAuditLog);
app.use('/',UserAlloc);
app.use('/',WorkDayCal);
app.use('/',UGRights);
app.use('/',UGMembers);
app.use('/',UGGroups);

app.use('/',Select);

const PORT = 8080;
app.listen(PORT, function() {
    console.log('File is running.')
});