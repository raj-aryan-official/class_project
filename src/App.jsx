import { useState, useEffect } from 'react'
import './App.css';
import Login from './Login';
import ProjectList from './ProjectList';
import KanbanBoard from './KanbanBoard';
import AutomationList from './AutomationList';
import ProjectMembers from './ProjectMembers';
import NotificationList from './NotificationList';
import BadgeList from './BadgeList';

function App() {
  const [user, setUser] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (user) fetchNotifications();
    // eslint-disable-next-line
  }, [user]);

  // TODO: Implement fetchNotifications and pass notifications to NotificationList/BadgeList if needed

  if (!user) {
    return (
      <div className="landing">
        <img src="/vite.svg" alt="TaskBoard Pro" className="landing-logo" />
        <div className="landing-title">TaskBoard Pro</div>
        <div className="landing-desc">
          Advanced Task Collaboration App with Workflow Automation.<br />
          Organize projects, manage tasks, automate workflows, and collaborate in real time.
        </div>
        <Login onLogin={setUser} user={user} />
      </div>
    );
  }

  return (
    <>
      {!selectedProject ? (
        <ProjectList user={user} onSelectProject={setSelectedProject} />
      ) : (
        <div>
          <button onClick={() => setSelectedProject(null)}>Back to Projects</button>
          <h2>{selectedProject.title}</h2>
          <ProjectMembers project={selectedProject} user={user} />
          <KanbanBoard project={selectedProject} user={user} />
          <AutomationList project={selectedProject} user={user} />
          <NotificationList user={user} />
          <BadgeList notifications={notifications} />
        </div>
      )}
    </>
  )
}

export default App
