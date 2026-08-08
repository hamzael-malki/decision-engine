/**
 * Tests de sécurité, sanitisation XSS et gestion des Edge Cases
 */
import { renderResult } from '../../ui/ResultRenderer.js';
import { render as renderTable } from '../../ui/renderers/table.js';
import { render as renderMatrix } from '../../ui/renderers/matrix.js';
import { escapeHtml } from '../../ui/renderers/utils.js';
import { calculatePercentages } from '../../helpers/percentages.js';
import { EisenhowerModel } from '../../providers/models/EisenhowerModel.js';
import { BCGModel } from '../../providers/models/BCGModel.js';

async function runSecurityTests() {
  console.log('\n🔒 RUNNING SECURITY & EDGE CASE TESTS\n');
  console.log('='.repeat(60));

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`   ✅ PASS: ${message}`);
      passed++;
    } else {
      console.log(`   ❌ FAIL: ${message}`);
      failed++;
    }
  }

  // 1. XSS Prevention in escapeHtml
  try {
    const xssPayload = '<script>alert("xss")</script>';
    const escaped = escapeHtml(xssPayload);
    assert(!escaped.includes('<script>') && escaped.includes('&lt;script&gt;'), 'escapeHtml escapes script tags correctly');
  } catch (err) {
    assert(false, `escapeHtml threw error: ${err.message}`);
  }

  // 2. XSS Prevention in Error Handler (ResultRenderer.js)
  try {
    const maliciousOutput = { modelId: '<img src=x onerror=alert(1)>', data: {} };
    // Force a renderer throw by corrupting data
    const renderedError = renderResult({ ...maliciousOutput, presentation: { resultType: 'matrix' }, data: { matrix: null } });
    assert(!renderedError.includes('<img src=x'), 'ResultRenderer escapes XSS in modelId / error details');
  } catch (err) {
    assert(false, `ResultRenderer security test threw error: ${err.message}`);
  }

  // 3. XSS Prevention in Matrix Renderer
  try {
    const xssMatrixOutput = {
      modelId: 'test',
      summary: '<script>alert(1)</script>',
      data: {
        matrix: {
          quadrant_a: ['<b onmouseover=alert(1)>XSS</b>']
        }
      }
    };
    const html = renderMatrix(xssMatrixOutput);
    assert(!html.includes('<script>') && !html.includes('<b onmouseover'), 'Matrix renderer escapes user inputs & summary');
  } catch (err) {
    assert(false, `Matrix renderer XSS test threw error: ${err.message}`);
  }

  // 4. Edge Case: Table Renderer with null/undefined rows
  try {
    const nullRowTable = {
      data: {
        rows: [null, undefined, { a: 'valid' }]
      }
    };
    const html = renderTable(nullRowTable);
    assert(html.includes('valid') && html.includes('Tableau'), 'Table renderer handles null/undefined rows without crashing');
  } catch (err) {
    assert(false, `Table renderer null row test threw error: ${err.message}`);
  }

  // 5. Percentage Rounding Sum (Exact 100%)
  try {
    // 3 items => 33.33% each => mathematically sums to 99% if using Math.round
    const pcts = calculatePercentages({ a: 1, b: 1, c: 1, d: 0 });
    const sum = Object.values(pcts).reduce((acc, v) => acc + v, 0);
    assert(sum === 100, `Percentage rounding sums exactly to 100% (got ${sum}%)`);
  } catch (err) {
    assert(false, `Percentage rounding test threw error: ${err.message}`);
  }

  // 6. Eisenhower Model Percentage Sum
  try {
    const eiseResult = await EisenhowerModel.execute({ id: 'eisenhower' }, { taches: 'Task 1 urgent important\nTask 2 important\nTask 3 urgent' });
    const dist = eiseResult.data.distribution;
    const sum = dist.do_first_pct + dist.schedule_pct + dist.delegate_pct + dist.eliminate_pct;
    assert(sum === 100, `Eisenhower model distribution sums exactly to 100% (got ${sum}%)`);
  } catch (err) {
    assert(false, `Eisenhower percentage test threw error: ${err.message}`);
  }

  // 7. BCG Model Percentage Sum & Object formatting
  try {
    const bcgResult = await BCGModel.execute({ id: 'bcg' }, { items: 'Product A | 25 | 30\nProduct B | 10 | 40\nProduct C | 5 | 5' });
    const dist = bcgResult.data.distribution;
    const sum = dist.stars_pct + dist.question_marks_pct + dist.cash_cows_pct + dist.dogs_pct;
    assert(sum === 100, `BCG model distribution sums exactly to 100% (got ${sum}%)`);

    const html = renderMatrix(bcgResult);
    assert(!html.includes('[object Object]') && html.includes('Product A'), 'BCG Matrix output renders product objects correctly without [object Object]');
  } catch (err) {
    assert(false, `BCG percentage/render test threw error: ${err.message}`);
  }

  console.log('\n' + '='.repeat(60));
  console.log(`\n🔒 SECURITY & EDGE CASE RESULTS: ${passed} ✅ passed, ${failed} ❌ failed\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runSecurityTests();
