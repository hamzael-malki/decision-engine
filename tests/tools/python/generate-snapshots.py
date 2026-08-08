import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
OUT_DIR = ROOT / 'snapshots'
OUT_DIR.mkdir(parents=True, exist_ok=True)

with open(ROOT / 'sample-outputs.json', 'r', encoding='utf-8') as f:
    outputs = json.load(f)

# Simple template helpers matching JS renderers' structure

def render_matrix(output):
    data = output.get('data', {})
    matrix = data.get('matrix', {})
    dist = data.get('distribution', {})
    summary = output.get('summary', '')
    recs = data.get('recommendations', {})

    def list_html(arr):
        if not arr:
            return '<li>—</li>'
        return ''.join(f'<li>{item}</li>' for item in arr)

    bar = lambda pct: f'<div class="dist-bar"><div class="fill" style="width:{min(100,int(pct or 0))}%"></div></div>'

    html = []
    if summary:
        html.append(f'<p class="summary">{summary}</p>')
    html.append('<div class="distribution-overview">')
    html.append(bar(dist.get('do_first_pct')))
    html.append(bar(dist.get('schedule_pct')))
    html.append(bar(dist.get('delegate_pct')))
    html.append(bar(dist.get('eliminate_pct')))
    html.append('</div>')
    html.append('<div class="quadrant-grid">')
    html.append(f"<div class=\"quadrant do-first\"><h4>🔴 Priorité ({dist.get('do_first_pct',0)}%)</h4><ul>{list_html(matrix.get('do_first'))}</ul>{('<p class=\"recommendation\">'+recs.get('do_first')+'</p>') if recs.get('do_first') else ''}</div>")
    html.append(f"<div class=\"quadrant schedule\"><h4>🟡 Planifier ({dist.get('schedule_pct',0)}%)</h4><ul>{list_html(matrix.get('schedule'))}</ul>{('<p class=\"recommendation\">'+recs.get('schedule')+'</p>') if recs.get('schedule') else ''}</div>")
    html.append(f"<div class=\"quadrant delegate\"><h4>🟢 Déléguer ({dist.get('delegate_pct',0)}%)</h4><ul>{list_html(matrix.get('delegate'))}</ul>{('<p class=\"recommendation\">'+recs.get('delegate')+'</p>') if recs.get('delegate') else ''}</div>")
    html.append(f"<div class=\"quadrant eliminate\"><h4>⚪ Éliminer ({dist.get('eliminate_pct',0)}%)</h4><ul>{list_html(matrix.get('eliminate'))}</ul>{('<p class=\"recommendation\">'+recs.get('eliminate')+'</p>') if recs.get('eliminate') else ''}</div>")
    html.append('</div>')
    return '\n'.join(html)


def render_canvas(output):
    d = output.get('data', {})
    summary = output.get('summary', '')
    person = d.get('personDescription', '')
    emotions = d.get('emotions', [])
    needs = d.get('needs', [])
    frustrations = d.get('frustrations', [])
    insights = d.get('insights', {})
    recs = d.get('recommendations', {})

    def ul(items):
        if not items:
            return '<ul><li>—</li></ul>'
        return '<ul>' + ''.join(f'<li>{i}</li>' for i in items) + '</ul>'

    parts = []
    if summary:
        parts.append(f'<p class="summary">{summary}</p>')
    parts.append('<div class="empathy-grid">')
    parts.append(f'<div class="empathy-section"><h4>💭 Pense</h4><p>{person or "N/A"}</p></div>')
    parts.append(f'<div class="empathy-section"><h4>😊 Ressent (Émotions)</h4>{ul(emotions)}</div>')
    parts.append(f'<div class="empathy-section"><h4>🤝 Besoins</h4>{ul(needs)}</div>')
    parts.append(f'<div class="empathy-section"><h4>😤 Frustrations</h4>{ul(frustrations)}</div>')
    parts.append('</div>')
    if insights:
        parts.append(f'<div class="insights"><strong>Insight:</strong> {insights.get("primaryEmotion","") or ""} — {insights.get("mainNeed","") or ""}</div>')
    if recs:
        parts.append('<div class="recommendations">')
        for k,v in recs.items():
            parts.append(f'<div><strong>{k}:</strong> {v}</div>')
        parts.append('</div>')
    return '\n'.join(parts)


def render_list(output):
    d = output.get('data', {})
    summary = output.get('summary', '')
    objective = d.get('objectif', '')
    otype = d.get('objectiveType', '')
    questions = d.get('coachingQuestions', {})
    actions = d.get('actionSuggestions', [])
    recs = d.get('recommendations', {})

    def mklist(arr):
        if not arr:
            return '<p>Aucune donnée</p>'
        return '<ul>' + ''.join(f'<li>{i}</li>' for i in arr) + '</ul>'

    parts = []
    if summary:
        parts.append(f'<p class="summary">{summary}</p>')
    if objective:
        parts.append(f'<p><strong>Objectif:</strong> {objective}</p>')
    if otype:
        parts.append(f'<p><strong>Type:</strong> {otype}</p>')
    parts.append('<div class="grow-sections">')
    parts.append(f'<div class="grow-section"><h4>🎯 Goal (Objectif)</h4>{mklist(questions.get("goal"))}</div>')
    parts.append(f'<div class="grow-section"><h4>📍 Reality (Réalité)</h4>{mklist(questions.get("reality"))}</div>')
    parts.append(f'<div class="grow-section"><h4>🛣️ Options</h4>{mklist(questions.get("options"))}</div>')
    parts.append(f'<div class="grow-section"><h4>⚡ Will (Volonté)</h4>{mklist(questions.get("will"))}</div>')
    parts.append('</div>')
    if actions:
        parts.append('<div class="coaching-questions"><h4>💡 Actions Suggérées</h4>' + mklist(actions) + '</div>')
    if recs:
        parts.append('<div class="recommendations">')
        for k,v in recs.items():
            parts.append(f'<div><strong>{k}:</strong> {v}</div>')
        parts.append('</div>')
    return '\n'.join(parts)


RENDER_MAP = {
    'matrix': render_matrix,
    'canvas': render_canvas,
    'list': render_list
}

for name, output in outputs.items():
    rtype = output.get('resultType') or output.get('data', {}).get('resultType') or 'fallback'
    renderer = RENDER_MAP.get(rtype)
    if not renderer:
        body = f'<pre>{json.dumps(output, indent=2, ensure_ascii=False)}</pre>'
    else:
        body = renderer(output)

    full = f"<!doctype html><html><head><meta charset=\"utf-8\"><title>Snapshot - {name}</title><link rel=\"stylesheet\" href=\"../assets/styles/components.css\"></head><body><div class=\"snapshot\">{body}</div></body></html>"
    out_file = OUT_DIR / f"{name}.html"
    out_file.write_text(full, encoding='utf-8')
    print('Wrote snapshot:', out_file)

print('Done. Snapshots in', OUT_DIR)
