const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const { 
    userOneId, 
    userTwoId, 
    userOne, 
    userTwo, 
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase 
} = require('./fixtures/db')

beforeEach(setupDatabase)

test('1 - Should Create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'Test task'
        })
        .expect(201)
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)    
})

test('2 - Should Request all tasks for userOne', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body.length).toBe(2)
})

test('3 - task Should not be deleted by userTwo', async () => {
    await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)
    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})

test('4 - Should sort tasks by description' , async () => {
    const response = await request(app)
        .get('/tasks?sortBy=description_asc')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body.length).not.toBeNull()
})

test('5 - Should sort tasks by completed' , async () => {
    const response = await request(app)
        .get('/tasks?sortBy=completed_asc')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body[0].completed).toBe(false)
})

test('6 - Should sort tasks by completed' , async () => {
    const response = await request(app)
        .get('/tasks?sortBy=completed_desc')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body[0].completed).toBe(true)
})

test('7 - Should sort tasks by createdAt' , async () => {
    const response = await request(app)
        .get('/tasks?sortBy=createdAt_asc')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body.length).not.toBeNull()
})

test('8 - Should sort tasks by updatedAt' , async () => {
    const response = await request(app)
        .get('/tasks?sortBy=updatedAt_asc')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body.length).not.toBeNull()
})

test('9 - Should limit tasks by 1' , async () => {
    const response = await request(app)
        .get('/tasks?limit=1')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body.length).toBe(1)
})

test('10 - Should skip tasks by 1' , async () => {
    const response = await request(app)
        .get('/tasks?skip=1')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body[0].description).toBe('Second task')
})

test('11 - Should fetch only incomplete tasks' , async () => {
    const response = await request(app)
        .get('/tasks?completed=false')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    response.body.forEach(task => {
        expect(task.completed).toBe(false)        
    });
})

test('12 - Should fetch only completed tasks' , async () => {
    const response = await request(app)
        .get('/tasks?completed=true')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    response.body.forEach(task => {
        expect(task.completed).toBe(true)        
    });
})

test('13 - Should not fetch other users task by id' , async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    response.body.forEach(task => {
        expect(task.owner).not.toEqual(userTwoId)        
    });
})

test('14 - Should not fetch user task by id if unauthenticated' , async () => {
    await request(app)
        .get('/tasks')
        .send()
        .expect(401);
})

test('15 - Should fetch user task by id' , async () => {
    const response = await request(app)
        .get(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
    expect(response.body._id).toEqual(taskOne._id.toString())
})

test('16 - Should not update other users task' , async () => {
    await request(app)
        .patch(`/tasks/${taskThree._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            "description": "SHOULD NOT BE UPDATED"
        })
        .expect(404);
})

test('17 - Should not delete task if unauthenticated' , async () => {
    await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .send()
        .expect(401);
})

test('18 - Should delete user task' , async () => {
    await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);   
        const task = await Task.findById(taskOne._id)
        expect(task).toBeNull() 
})

test('19 - Should not update task with invalid description' , async () => {
    await request(app)
        .patch(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            "description": ""
        })
        .expect(400);
})

test('20 - Should not update task with invalid completed' , async () => {
    await request(app)
        .patch(`/tasks/${taskThree._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send({
            "completed": ""
        })
        .expect(400);
})

test('21 - Should not create task with invalid description' , async () => {
    await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            
        })
        .expect(400);
})

test('22 - Should not create task with invalid completed' , async () => {
    await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            "description": "fish",
            "completed": ""
        })
        .expect(400);
})