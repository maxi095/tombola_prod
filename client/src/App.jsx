import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import TaskPage from "./pages/TaskPage";
import TaskFormPage from "./pages/TaskFormPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import ActivityPage from "./pages/ActivityPage";
import ActivityFormPage from "./pages/ActivityFormPage";
import ActivityViewPage from "./pages/ActivityViewPage";
import UserPage from "./pages/UserPage";
import UserFormPage from "./pages/UserFormPage";
import UserViewPage from "./pages/UserViewPage";
import AcademicUnitPage from "./pages/AcademicUnitPage";
import ProjectPage from "./pages/ProjectPage";
import StudentPage from "./pages/StudentPage";
import StudentFormPage from "./pages/StudentFormPage";
import DirectorPage from "./pages/DirectorPage";

{/*import ProtectedRoute from "./ProtectedRoute";*/}
import ProtectedRoute from "./components/ProtectedRoute";

import { TaskProvider } from "./context/TasksContext";
import { ActivityProvider } from "./context/ActivityContext";
import BarraTareas from "./components/BarraTareas";
import Sidebar from "./components/Sidebar";
import { UserProvider } from "./context/UserContext";
import { AcademicUnitProvider } from "./context/AcademicUnitContext";
import { ProjectProvider } from "./context/ProjectContext";
import ProjectFormPage from "./pages/ProjectFormPage";
import { DimensionProvider } from "./context/DimensionContext";
import ActivityProjectPage from "./pages/ActivityProjectPage";
import { ActivityProjectProvider } from "./context/ActivityProjectContext";
import ActivityProjectFormPage from "./pages/ActivityProjectFormPage";
import AcademicUnitFormPage from "./pages/AcademicUnitFormPage";
import ActivityStudentPage from "./pages/ActivityStudentPage";
import Unauthorized from "./pages/Unauthorized";
import ActivityProjectViewPage from "./pages/ActivityProjectViewPage";


import './assets/css/Global.css';



function App() {
  return (
    <AuthProvider>
      <DimensionProvider>
      <ProjectProvider>
        <ActivityProjectProvider>
      <AcademicUnitProvider>
        <UserProvider>
          <TaskProvider>
            <ActivityProvider>
              <BrowserRouter>
              <div className="flex">
                <SidebarWrapper />
                <main className="container mx-auto px-10"> 
                  <BarraTareas></BarraTareas>
                  <Routes>
                    <Route path= '/' element = {<HomePage/>} />
                    <Route path= '/login' element = {<LoginPage/>} />
                    
                    {/*<Route path= '/register' element = {<RegisterPage/>} />
            
                      <Route path= '/tasks' element = {<TaskPage/>} />
                      <Route path= '/tasks/new' element = {<TaskFormPage/>} />
                      <Route path= '/tasks/:id' element = {<TaskFormPage/>} />*/}
                      
                      <Route path= '/profile' element = {<ProtectedRoute allowedRoles={['Administrador', 'Secretario', 'Director', 'Estudiante']}><ProfilePage/></ProtectedRoute>} />

                      <Route path='/users' element={<ProtectedRoute allowedRoles={['Administrador']}><UserPage /></ProtectedRoute>} />
                      <Route path='/users/new' element={<ProtectedRoute allowedRoles={['Administrador']}><UserFormPage /></ProtectedRoute>} />
                      <Route path='/users/edit/:id' element={<ProtectedRoute allowedRoles={['Administrador']}><UserFormPage /></ProtectedRoute>} />
                      <Route path='/users/view/:id' element={<ProtectedRoute allowedRoles={['Administrador']}><UserViewPage /></ProtectedRoute>} />

                      <Route path='/directors' element={<ProtectedRoute allowedRoles={['Administrador', 'Secretario']}><DirectorPage /></ProtectedRoute>} />

                      <Route path='/students' element={<ProtectedRoute allowedRoles={['Administrador', 'Secretario', 'Director']}><StudentPage /></ProtectedRoute>} />
                      <Route path='/students/new' element={<ProtectedRoute allowedRoles={['Administrador', 'Secretario', 'Director']}><StudentFormPage /></ProtectedRoute>} />
                      <Route path='/students/edit/:id' element={<ProtectedRoute allowedRoles={['Administrador', 'Secretario', 'Director']}><StudentFormPage /></ProtectedRoute>} />

                      <Route path= '/academic-units' element = {<ProtectedRoute allowedRoles={['Administrador']}><AcademicUnitPage/></ProtectedRoute>} />
                      <Route path= '/academic-units/new' element = {<ProtectedRoute allowedRoles={['Administrador']}><AcademicUnitFormPage/></ProtectedRoute>} />
                      <Route path= '/academic-units/edit/:id' element = {<ProtectedRoute allowedRoles={['Administrador']}><AcademicUnitFormPage/></ProtectedRoute>} />

                      <Route path= '/projects' element = {<ProtectedRoute allowedRoles={['Administrador', 'Secretario', 'Director']}><ProjectPage/></ProtectedRoute>} />
                      <Route path= '/projects/new' element = {<ProtectedRoute allowedRoles={['Administrador', 'Secretario', 'Director']}><ProjectFormPage/></ProtectedRoute>} />
                      <Route path= '/projects/edit/:id' element = {<ProtectedRoute allowedRoles={['Administrador', 'Secretario', 'Director']}><ProjectFormPage/></ProtectedRoute>} />

                      <Route path= '/activity-projects' element = {<ProtectedRoute allowedRoles={['Administrador', 'Secretario', 'Director']}><ActivityProjectPage/></ProtectedRoute>} />
                      <Route path= '/activity-projects/new' element = {<ProtectedRoute allowedRoles={['Administrador', 'Secretario', 'Director']}><ActivityProjectFormPage/></ProtectedRoute>} />
                      <Route path= '/activity-projects/edit/:id' element = {<ProtectedRoute allowedRoles={['Administrador', 'Secretario', 'Director']}><ActivityProjectFormPage/></ProtectedRoute>} />
                      <Route path= '/activity-projects/view/:id' element = {<ProtectedRoute allowedRoles={['Administrador', 'Secretario', 'Director']}><ActivityProjectViewPage/></ProtectedRoute>} />
                    
                      <Route path= '/activities' element={<ProtectedRoute allowedRoles={['Administrador', 'Secretario', 'Director']}><ActivityStudentPage /></ProtectedRoute>} />
                      <Route path= '/activities/new' element = {<ProtectedRoute allowedRoles={['Administrador', 'Secretario', 'Director']}><ActivityFormPage/></ProtectedRoute>} />
                      <Route path= '/activities/edit/:id' element = {<ProtectedRoute allowedRoles={['Administrador', 'Secretario', 'Director']}><ActivityFormPage/></ProtectedRoute>} />
                      <Route path= '/activities/view/:id' element = {<ProtectedRoute allowedRoles={['Administrador', 'Secretario', 'Director']}><ActivityViewPage/></ProtectedRoute>} />

                      <Route path= '/my-activities' element = {<ProtectedRoute allowedRoles={['Estudiante']}><ActivityPage/></ProtectedRoute>} />

                      <Route path='/unauthorized' element= {<Unauthorized/>}/>
                   

                  </Routes>
                </main>
                </div>
              </BrowserRouter>
            </ActivityProvider>
          </TaskProvider>
        </UserProvider>
      </AcademicUnitProvider>
      </ActivityProjectProvider>
      </ProjectProvider>
      </DimensionProvider>
    </AuthProvider>
  )
}

function SidebarWrapper() {
  const { user } = useAuth();

  // Mostrar el Sidebar solo si el usuario tiene el rol 'Administrador', 'Director' o 'Secretario'
  if (!user || !['Administrador', 'Director', 'Secretario'].includes(user.roles)) return null;

  return <Sidebar />;
}

export default App