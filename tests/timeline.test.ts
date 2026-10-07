import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkpoints, chapterAt, projectAt, smoothProgress, mediaTime } from '../src/lib/timeline.ts';
import { validateContact } from '../src/lib/contact-validation.ts';

test('one contiguous timeline drives chapters, project boundaries, and safe reversible media seeks', () => {
  checkpoints.forEach((point, index) => {
    if (index) assert.equal(point.start, checkpoints[index - 1].end);
    assert.equal(chapterAt(point.start), point.id);
  });
  assert.equal(chapterAt(1), 'contact');
  assert.equal(projectAt(0.45, 3), 0);
  assert.equal(projectAt(0.56, 3), 1);
  assert.equal(projectAt(0.75, 3), 2);
  assert.ok(smoothProgress(0.5, 1, 1 / 60) > 0.5);
  assert.ok(smoothProgress(0.5, 0, 1 / 60) < 0.5);
  assert.equal(mediaTime(-1, 4), 0);
  assert.ok(mediaTime(2, 4) < 4);
  assert.equal(mediaTime(1, 0), 0);
});

test('contact boundary rejects malformed and oversized data', () => {
  const valid = { name: 'Astraa', email: 'hello@example.com', message: 'Let us build something.' };
  assert.ok(validateContact(valid));
  for (const value of [null, {}, { ...valid, email: 'invalid' }, { ...valid, name: ' ' }, { ...valid, message: 'short' }, { ...valid, message: 'x'.repeat(5001) }]) assert.equal(validateContact(value), false);
});
