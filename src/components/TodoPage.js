//** import React 
import { useState, useContext, useEffect } from 'react';

//** third party mui 
import {Box, Button, TextField, Typography, List, ListItem, IconButton, Tabs, Tab, CircularProgress,} from '@mui/material';
import { 
    Delete as DeleteIcon,
    Check as CheckIcon,
    Add as AddIcon, 
    Logout as LogoutIcon,
    ClearAll as ClearAllIcon,
    Edit as EditIcon, 
    Save as SaveIcon,
    Close as CloseIcon,
    Light as LightbulbIcon,
    Restore as RestoreIcon} from '@mui/icons-material';

//** Redux 
import { useDispatch, useSelector } from 'react-redux';
import { addTask, toggleComplete, deleteTask, clearTasks, updateTask, restoreTask, clearDeletedTasks } from '../redux/todoSlice';
import { logoutUser } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';

//** Context 
import { SnackbarContext } from '../context/SnackbarContext';
 
const TodoPage = () => {
    
    //** States 
    const [task, setTask] = useState('');
    const [currentTab, setCurrentTab] = useState(1);
    const [loading, setLoading] = useState(false);
    const [editTaskId, setEditTaskId] = useState(null);
    const [editTaskText, setEditTaskText] = useState('');

    // ** Router
    const navigate = useNavigate();

    // ** Redux
    const dispatch = useDispatch();
    const tasks = useSelector(state => state.todos.tasks);
    const deletedTasks = useSelector(state => state.todos.deletedTasks);
    const { user } = useSelector(state => state.auth);

    //** Context
    const { showSnackbar } = useContext(SnackbarContext);
    
    //** secu page   
    useEffect(() => {
        if (user == null) {
            navigate('/login');
        }
    }, [user, navigate]);
    
    //** add Task
    const handleAddTask = () => {
        if (task.trim()) {
            setLoading(true);
            dispatch(addTask(task));
            setTask('');
            setLoading(false);
            showSnackbar('Task added successfully!', 'success');

        }
    };
    
    //** Remove Task
    const handleDeleteTask = (id) => {
        setLoading(true);
        dispatch(deleteTask(id));
        setLoading(false);
        showSnackbar('Task moved to deleted successfully!', 'error');

    };

    //**  clear all task
    const handleClearTasks = () => {
        setLoading(true);
        dispatch(clearTasks());
        setLoading(false);
        showSnackbar('All Tasks Cleard successfully!', 'error');

    };

    //** logout with deleting token
    const handleLogOut = () => {
        dispatch(logoutUser());
        navigate('/');
        showSnackbar('Logout successful!', 'success');

    };

    //** eddit task
    const handleEditTask = (id, text, completed) => {
        
        if(completed) {
            showSnackbar('Task cant be editing , Task Already completed', 'warning');
        } else {
            setEditTaskId(id);
            setEditTaskText(text);
        }

    };

    //** save edited task 
    const handleSaveTask = (id) => {
        if (editTaskText.trim()) {
            dispatch(updateTask({ id, newText: editTaskText }));
            setEditTaskId(null);
            setEditTaskText('');
            showSnackbar('Task saved successfully!', 'info');

        }
    };

    //** cancel proccess editation 
    const handleCancelEdit = () => {
        setEditTaskId(null);
        setEditTaskText('');
    };

    //**  mapping task for ever spacific category 
    const filteredTasks = () => {
        switch (currentTab) {
            case 0:
                return tasks.filter(task => !task.completed);
            case 1:
                return tasks;
            case 2:
                return tasks.filter(task => task.completed);
            case 3:
                return deletedTasks; 
            default:
                return tasks;
        }
    };

    return (
        <>
            <Box sx={{ p: 5, mx: 'auto', maxWidth: '100%', minHeight:'70vh' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={handleAddTask}
                        startIcon={<AddIcon />}
                    >
                        Add Task
                    </Button>
                    
                    <TextField
                        label="Add a task"
                        variant="outlined"
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                        sx={{ width: '60%' }}
                    />
                    
                    <Button 
                        variant="contained" 
                        color="secondary" 
                        onClick={handleClearTasks}
                        startIcon={<ClearAllIcon />}
                    >
                        Clear
                    </Button>
                </Box>
                
                <Tabs 
                    value={currentTab} 
                    onChange={(e, val) => setCurrentTab(val)} 
                    centered
                    sx={{ mb: 2 }}
                >
                    <Tab label={`Pending (${tasks.filter(task => !task.completed).length})`} />
                    <Tab label={`All (${tasks.length})`} />
                    <Tab label={`Completed (${tasks.filter(task => task.completed).length})`} />
                    <Tab label={`Deleted (${deletedTasks.length})`} /> {/* New tab for deleted tasks */}
                </Tabs>
                
                {loading ? 
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                        <CircularProgress />
                    </Box>
                    : 
                    <List>
                        {filteredTasks().map((task) => (
                            <ListItem 
                                key={task.id} 
                                sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center', 
                                    borderBottom: '1px solid #e0e0e0' 
                                }}
                            >
                                {currentTab === 3 ? (
                                    <Typography 
                                        variant="body1" 
                                        sx={{ color: 'gray' }}
                                    >
                                        {task.text}
                                    </Typography>
                                ) : editTaskId === task.id ? (
                                    <TextField
                                        variant="outlined"
                                        value={editTaskText}
                                        onChange={(e) => setEditTaskText(e.target.value)}
                                        sx={{ width: '60%' }}
                                    />
                                ) : (
                                    <Typography 
                                        variant="body1" 
                                        sx={{ 
                                            textDecoration: task.completed ? 'line-through' : 'none', 
                                            color: task.completed ? 'gray' : 'text.primary' 
                                        }}
                                    >
                                        {task.text}
                                    </Typography>
                                )}
                                
                                <Box>
                                    {currentTab === 3 ? (
                                        <IconButton onClick={() => {
                                                dispatch(restoreTask(task.id))
                                                showSnackbar('Task restored successfully!', 'info');

                                        }}>
                                            <RestoreIcon color="primary" />
                                        </IconButton>
                                    ) : editTaskId === task.id ? (
                                        <>
                                            <IconButton onClick={() => handleSaveTask(task.id)}>
                                                <SaveIcon color="primary" />
                                            </IconButton>
                                            <IconButton onClick={handleCancelEdit}>
                                                <CloseIcon color="error" />
                                            </IconButton>
                                        </>
                                    ) : (
                                        <>
                                            <IconButton onClick={() =>{ 
                                                dispatch(toggleComplete(task.id))
                                                if(!task.completed){
                                                    showSnackbar('Task completed successfully!', 'info')
                                                }
                                                else{ 
                                                    showSnackbar('Task Uncompleted!', 'warning')}
                                            }}>
                                               {task.completed ? <CheckIcon /> : <LightbulbIcon/>} 
                                            </IconButton>
                                            <IconButton   onClick={() => handleEditTask(task.id, task.text, task.completed)}>
                                                <EditIcon color="primary" />
                                            </IconButton>
                                            <IconButton onClick={() => handleDeleteTask(task.id)}>
                                                <DeleteIcon color="error" />
                                            </IconButton>
                                        </>
                                    )}
                                </Box>
                            </ListItem>
                        ))}
                    </List>
                }
                
                {currentTab === 3 && deletedTasks.length > 0 && (
                    <Button 
                        variant="contained" 
                        color="error" 
                        onClick={() => {dispatch(clearDeletedTasks())
                            showSnackbar('Task have been  deleted successfully!', 'warning');

                        }}
                        sx={{ mt: 2 }}
                    >
                        Clear Deleted Tasks
                    </Button>
                )}
            </Box>
            <Box sx={{display:'flex',justifyContent:'center'}}>
                <Button 
                    variant="contained" 
                    color="secondary" 
                    onClick={handleLogOut}
                    endIcon={<LogoutIcon />}
                    sx={{ background:'black' }}
                >
                    Log Out
                </Button>
            </Box>
            
        </>
    );
};

export default TodoPage;
