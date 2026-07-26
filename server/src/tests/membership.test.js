const User = require('../models/User');
const Membership = require('../models/Membership');
const { connect, closeDatabase, clearDatabase } = require('./testDb');

beforeAll(async () => await connect());
afterEach(async () => await clearDatabase());
afterAll(async () => await closeDatabase());

describe('Membership lejárat-logika', () => {
  it('automatikusan 30 napra állítja be a lejáratot, ha nincs megadva', async () => {
    const user = await User.create({ name: 'Teszt Elek', email: 'teszt@pelda.hu' });
    const membership = await Membership.create({ user: user._id, type: 'felnott', price: 19000 });

    const diffInDays = Math.round((membership.endDate - membership.startDate) / (1000 * 60 * 60 * 24));
    expect(diffInDays).toBe(30);
  });

  it('isActive true, ha a lejárat a jövőben van', async () => {
    const user = await User.create({ name: 'Teszt Elek', email: 'teszt@pelda.hu' });
    const membership = await Membership.create({ user: user._id, type: 'diak', price: 15000 });

    expect(membership.isActive).toBe(true);
  });

  it('isActive false, ha a lejárat a múltban van', async () => {
    const user = await User.create({ name: 'Teszt Elek', email: 'teszt@pelda.hu' });
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);

    const membership = await Membership.create({
      user: user._id, type: 'felnott', price: 19000, endDate: pastDate,
    });

    expect(membership.isActive).toBe(false);
  });
});