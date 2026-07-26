const User = require('../models/User');
const WorkoutPlan = require('../models/WorkoutPlan');
const { connect, closeDatabase, clearDatabase } = require('./testDb');

beforeAll(async () => await connect());
afterEach(async () => await clearDatabase());
afterAll(async () => await closeDatabase());

describe('WorkoutPlan validáció', () => {
  it('elfogadja a szettet reps nélkül, ha toFailure true', async () => {
    const user = await User.create({ name: 'Teszt Elek', email: 'teszt@pelda.hu' });

    const plan = await WorkoutPlan.create({
      user: user._id,
      title: 'Teszt terv',
      splitType: 'upper_lower',
      days: [{
        day: 'Hétfő - Upper A',
        exercises: [{ name: 'Fekvenyomás', sets: [{ weight: 60, toFailure: true }] }],
      }],
    });

    expect(plan.days[0].exercises[0].sets[0].reps).toBeUndefined();
  });

  it('hibát dob, ha nincs reps és toFailure sincs bejelölve', async () => {
    const user = await User.create({ name: 'Teszt Elek', email: 'teszt@pelda.hu' });

    await expect(
      WorkoutPlan.create({
        user: user._id,
        title: 'Teszt terv',
        splitType: 'upper_lower',
        days: [{
          day: 'Hétfő - Upper A',
          exercises: [{ name: 'Fekvenyomás', sets: [{ weight: 60 }] }],
        }],
      })
    ).rejects.toThrow();
  });
});