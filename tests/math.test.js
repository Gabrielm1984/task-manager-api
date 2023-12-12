const { add, calculateTip, fahrenheitToCelsius, celsiusToFahrenheit } = require('../src/math')

test('Calculate 30% tip form total of 10 should be 13 ', () => {
    const total = calculateTip(10, .3)
    expect(total).toBe(13)
})

test('Calculate default tip form total of 10 should be 11 ', () => {
    const total = calculateTip(10)
    expect(total).toBe(11)
})

test('Should convert 32 F to 0 C', () => {
    const value = fahrenheitToCelsius(32)
    expect(value).toBe(0)
})

test('Should convert 0 C to 32 F', () => {
    const value = celsiusToFahrenheit(0)
    expect(value).toBe(32)
})

test('Promiss add testing', (done) => {
    add(1,3).then((sum) => {
        expect(sum).toBe(4)
        done()
    })
})

test('Async add testing', async () => {
    const sum = await add(10,3)
    expect(sum).toBe(13)
})