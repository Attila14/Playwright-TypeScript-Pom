import { test, expect } from '@playwright/test';

test.describe('Restful Booker API', () => {
  test('GET /booking - list all booking ids', async ({ request }) => {
    const response = await request.get('/booking');
    expect(response.status()).toBe(200);

    const bookingIds = await response.json();
    expect(Array.isArray(bookingIds)).toBe(true);
    expect(bookingIds.length).toBeGreaterThan(0);
    expect(bookingIds[0]).toHaveProperty('bookingid');
  });

  test('GET /booking/{id} - get a single booking', async ({ request }) => {
    const listResponse = await request.get('/booking');
    const bookingIds = await listResponse.json();
    const firstId = bookingIds[0].bookingid;

    const response = await request.get(`/booking/${firstId}`);
    expect(response.status()).toBe(200);

    const booking = await response.json();
    expect(booking).toHaveProperty('firstname');
    expect(booking).toHaveProperty('lastname');
    expect(booking).toHaveProperty('totalprice');
    expect(booking).toHaveProperty('bookingdates');
  });

  test('POST /booking - create a booking', async ({ request }) => {
    const newBooking = {
      firstname: 'Jim',
      lastname: 'Brown',
      totalprice: 111,
      depositpaid: true,
      bookingdates: {
        checkin: '2026-01-01',
        checkout: '2026-01-05',
      },
      additionalneeds: 'Breakfast',
    };

    const response = await request.post('/booking', { data: newBooking });
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('bookingid');
    expect(body.booking).toMatchObject(newBooking);
  });

  test('POST /auth - create an auth token', async ({ request }) => {
    const response = await request.post('/auth', {
      data: {
        username: 'admin',
        password: 'password123',
      },
    });
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('token');
    expect(typeof body.token).toBe('string');
    expect(body.token.length).toBeGreaterThan(0);
  });

  test('DELETE /booking/{id} - delete a booking with auth token', async ({ request }) => {
    // Create a booking to delete
    const newBooking = {
      firstname: 'Delete',
      lastname: 'Me',
      totalprice: 50,
      depositpaid: false,
      bookingdates: {
        checkin: '2026-02-01',
        checkout: '2026-02-02',
      },
    };
    const createResponse = await request.post('/booking', { data: newBooking });
    const { bookingid } = await createResponse.json();

    // Get an auth token
    const authResponse = await request.post('/auth', {
      data: { username: 'admin', password: 'password123' },
    });
    const { token } = await authResponse.json();

    // Delete the booking using the token
    const deleteResponse = await request.delete(`/booking/${bookingid}`, {
      headers: { Cookie: `token=${token}` },
    });
    expect(deleteResponse.status()).toBe(201);

    // Verify the booking no longer exists
    const getResponse = await request.get(`/booking/${bookingid}`);
    expect(getResponse.status()).toBe(404);
  });
});
