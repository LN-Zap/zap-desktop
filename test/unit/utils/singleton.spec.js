import createSingletonFactory from '@zap/utils/singleton'

class Class1 {}
class Class2 {}

describe('createSingletonFactory', () => {
  it('creates only one instance per class', () => {
    const instanceDefinition = {
      class1: Class1,
      class2: Class2,
    }

    const factory = createSingletonFactory(instanceDefinition)
    expect(factory('class1')).not.toBe(factory('class2'))
    expect(factory('class1')).toBe(factory('class1'))
    expect(factory('class2')).toBe(factory('class2'))
  })

  it('return null for unknown definitions', () => {
    const instanceDefinition = {
      class1: Class1,
    }

    const factory = createSingletonFactory(instanceDefinition)
    expect(factory('class2')).toBe(null)
  })
})
