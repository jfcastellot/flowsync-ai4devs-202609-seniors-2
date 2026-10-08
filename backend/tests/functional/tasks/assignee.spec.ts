import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('Tasks | responsable en la tarea', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  async function signup(client: any, fullName: string | null, email: string) {
    const response = await client.post('/api/v1/auth/signup').json({
      fullName,
      email,
      password: 'secreto123',
      passwordConfirmation: 'secreto123',
    })

    response.assertStatus(200)
    return response.body().data.token as string
  }

  async function createTask(client: any, token: string, title: string) {
    const response = await client
      .post('/api/v1/tasks')
      .header('Authorization', `Bearer ${token}`)
      .json({ title })

    response.assertStatus(201)
    return response.body().data
  }

  test('la tarea identifica al responsable por nombre e iniciales', async ({ client, assert }) => {
    const token = await signup(client, 'Ada Lovelace', 'ada@example.com')
    const created = await createTask(client, token, 'Revisar el informe')

    const response = await client
      .get('/api/v1/tasks')
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)

    const task = response.body().data.find((item: { id: number }) => item.id === created.id)
    assert.exists(task)
    assert.equal(task.assignee.fullName, 'Ada Lovelace')
    assert.equal(task.assignee.initials, 'AL')
  })

  test('el responsable de la tarea no expone el email de la cuenta', async ({ client, assert }) => {
    const token = await signup(client, 'Ada Lovelace', 'ada@example.com')
    const created = await createTask(client, token, 'Revisar el informe')

    const response = await client
      .get('/api/v1/tasks')
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)

    const task = response.body().data.find((item: { id: number }) => item.id === created.id)
    assert.exists(task)
    assert.notInclude(Object.keys(task.assignee), 'email')
  })
})
