const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const boardController = require('../controllers/boardController');
const columnController = require('../controllers/columnController');
const taskController = require('../controllers/taskController');
const authenticationController = require('../controllers/authenticationController');
const boardMembersController  = require('../controllers/boardMembersController');



router.post('/login', authenticationController.login);        
router.post('/register', authenticationController.register);        
router.post('/invite', boardMembersController.inviteMember);
router.get('/board-members', boardMembersController.getBoardMembers);

// User routes
router.post('/users', userController.createUser);        
router.get('/users', userController.getAllUsers);    
router.get('/users/:id', userController.getUserById);     
router.patch('/users/:id', userController.updateUser);      
router.delete('/users/:id', userController.deleteUser);  

// Board routes
router.post('/boards', boardController.createBoard);     
router.get('/boards', boardController.getAllBoards);      
router.get('/boards/:id', boardController.getBoardById);   
router.patch('/boards/:id', boardController.updateBoard);    
router.delete('/boards/:id', boardController.deleteBoard); 

// Column routes
router.post('/columns', columnController.createColumn);    
router.get('/columns', columnController.getAllColumns);    
router.get('/columns/:id', columnController.getColumnById); 
router.patch('/columns/:id', columnController.updateColumn);  
router.delete('/columns/:id', columnController.deleteColumn); 

// Task routes
router.post('/tasks', taskController.createTask);         
router.get('/tasks', taskController.getAllTasks);          
router.get('/tasks/:id', taskController.getTaskById);      
router.patch('/tasks/:id', taskController.updateTask);        
router.delete('/tasks/:id', taskController.deleteTask);   

module.exports = router;
