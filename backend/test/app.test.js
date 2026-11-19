import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { createApp, parseAllowedOrigins } from '../src/app.js'

let server
let base

before(async () => {
    server = createApp().listen(0)
    await new Promise((resolve) => server.once('listening', resolve))
    base = `http://127.0.0.1:${server.address().port}/api/v1`
})

after(() => new Promise((resolve) => server.close(resolve)))

const postJson = (path, body, raw = false) =>
    fetch(`${base}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: raw ? body : JSON.stringify(body)
    })

test('parseAllowedOrigins splits, trims and drops empties', () => {
    assert.deepEqual(parseAllowedOrigins(' http://a.com , ,http://b.com'), [
        'http://a.com',
        'http://b.com'
    ])
    assert.deepEqual(parseAllowedOrigins(), ['http://localhost:5173'])
})

test('GET /health returns success', async () => {
    const res = await fetch(`${base}/health`)
    assert.equal(res.status, 200)
    assert.deepEqual(await res.json(), { success: true })
})

test('unknown routes return a JSON 404', async () => {
    const res = await fetch(`${base}/nope`)
    assert.equal(res.status, 404)
    const body = await res.json()
    assert.equal(body.success, false)
    assert.equal(body.message, 'Route not found')
})

test('malformed JSON is rejected with a 400', async () => {
    const res = await postJson('/auth/login', '{not json', true)
    assert.equal(res.status, 400)
    assert.equal((await res.json()).success, false)
})

test('login rejects missing fields before touching the database', async () => {
    const res = await postJson('/auth/login', { email: 'a@b.co' })
    assert.equal(res.status, 400)
    assert.equal((await res.json()).message, 'Please fill all the fields')
})

test('login rejects non-string credentials (query operator injection)', async () => {
    const res = await postJson('/auth/login', { email: { $gt: '' }, password: 'x' })
    assert.equal(res.status, 400)
    assert.equal((await res.json()).message, 'Invalid credentials')
})

test('register validates email format and password length', async () => {
    let res = await postJson('/auth/register', { name: 'A', email: 'bad', password: 'secret1' })
    assert.equal(res.status, 400)
    assert.equal((await res.json()).message, 'Please enter a valid email address')

    res = await postJson('/auth/register', { name: 'A', email: 'a@b.co', password: '123' })
    assert.equal(res.status, 400)
    assert.match((await res.json()).message, /at least 6 characters/)
})
