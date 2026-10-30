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


test('GET /booking/{id} - validate specific values', async ({ request }) => {

const listResponse = await request.get('/booking');

// First response body
const bookingIds = await listResponse.json();
console.log('GET /booking Body:');
console.log(JSON.stringify(bookingIds, null, 2));

const firstId = bookingIds[0].bookingid;

const response = await request.get(`/booking/${firstId}`);

expect(response.status()).toBe(200);

// Second response body
const booking = await response.json();
console.log(`GET /booking/${firstId} Body:`);
console.log(JSON.stringify(booking, null, 2));

  console.log('Firstname:', booking.firstname);
  console.log('Check-in:', booking.bookingdates.checkin);
  console.log('Checkout:', booking.bookingdates.checkout);

  expect(booking.firstname).toBeDefined();
  expect(booking.bookingdates.checkin).toBe('2026-01-01');
  expect(booking.bookingdates.checkout).toBe('2026-01-05');
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

    const newBookingWrong = {
      firstname: 'Jim',
      lastname: 'White',
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
    expect(newBookingWrong).toMatchObject(newBooking);
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


  test('DELETE /booking/{id} - delete a booking', async ({ request }) => {

  // 1. Get an existing booking
  const listResponse = await request.get('/booking');

  expect(listResponse.status()).toBe(200);

  const bookingIds = await listResponse.json();
  const firstId = bookingIds[0].bookingid;

  console.log('Booking ID to delete:', firstId);


  // 2. Get authentication token
  const authResponse = await request.post('/auth', {
    data: {
      username: 'admin',
      password: 'password123'
    }
  });

  expect(authResponse.status()).toBe(200);

  const authBody = await authResponse.json();
  const token = authBody.token;


  // 3. Delete the booking
  const deleteResponse = await request.delete(`/booking/${firstId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `token=${token}`
    }
  });

  expect(deleteResponse.status()).toBe(201);

  console.log('Booking deleted:', firstId);


  // 4. Try to GET the deleted booking
  const getResponse = await request.get(`/booking/${firstId}`);


  // 5. Verify booking no longer exists
  expect(getResponse.status()).toBe(404);

  console.log('Verified booking no longer exists.');
});



test('network mocking with page.route', async ({ page }) => {

  // Mock the API
  await page.route('https://example.com/api/user', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        name: 'Attila',
        role: 'Tester'
      })
    });
  });

  // Make the API request
  const response = await page.evaluate(async () => {
    const res = await fetch('https://example.com/api/user');
    return await res.json();
  }) as { name: string; role: string };

  // Print response
  console.log(response);

  // Assertions
  expect(response.name).toBe('Attila');
  expect(response.role).toBe('Tester');
});

});
