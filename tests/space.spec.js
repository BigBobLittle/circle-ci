const request = require('supertest');
const app = require('../app');

describe('Space test suite', () => {
  // extend jest matchers
  expect.extend({
    toBeActive: (received) => {
      const pass = received === true; //

      if (pass) {
        return {
          message: () => `expected ${received} is an acceptable status`,
          pass: true,
        };
      }
      return {
        message: () => `expected ${received} is not an acceptable status`,
        pass: false,
      };
    },
  });
  test('test /destination endpoint', async () => {
    const response = await request(app).get('/space/destinations');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([
      'Mars',
      'Moon',
      'Earth',
      'Mercury',
      'Venus',
      'Jupiter',
    ]);
    expect(response.body).toHaveLength(6);
    expect(response.body).toEqual(expect.arrayContaining(['Earth']));
  });

  test('test /space dot flights', async () => {
    const response = await request(app).get('/space/flights/seats');

    expect(response.statusCode).toBe(200);

    // expect an array of various objects
    expect(response.body.starship).toEqual(
      expect.arrayContaining([expect.any(Object)]),
    );

    // array will contain firstClass object
    expect(response.body.starship).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ firstClass: expect.any(Object) }),
      ]),
    );

    // array will contain business class object
    expect(response.body.starship).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ businessClass: expect.any(Object) }),
      ]),
    );

    // under businessClass object check if drinkServed object is present and contains array
    expect(response.body.starship).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          businessClass: expect.objectContaining({
            drinksServed: expect.any(Array),
          }),
        }),
      ]),
    );

    // Checking that under the firstClass: Object we have the option ludacris in the seatHover Object
    expect(response.body.starship).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          firstClass: expect.objectContaining({
            seatHover: expect.objectContaining({
              cryoMode: expect.arrayContaining(['ludacris']),
            }),
          }),
        }),
      ]),
    );

    // Checking that under the firstClass: Object we have the option plaid in the seatHover Object
    expect(response.body.starship).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          firstClass: expect.objectContaining({
            seatHover: expect.objectContaining({
              cryoMode: expect.arrayContaining(['plaid']),
            }),
          }),
        }),
      ]),
    );
  });

  it('test toBeactive /flights endpoint', async () => {
    const response = await request(app).get('/space/flights');

    expect(response.body[0].active).toBeActive();
    expect(response.body[1].active).not.toBeActive();
    // expect(response.body[0].active).not.toBeActive();
  });
});
