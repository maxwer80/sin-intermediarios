/**
 * Admin Panel - SIN INTERMEDIARIOS
 * Gestión de Preguntas
 */

// Supabase Configuration - Proxy Inverso (Nginx)
// Al dejar vacío, las peticiones van a /rest/v1 en el mismo dominio
const SUPABASE_URL = '';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NjkwMDkxMjEsImV4cCI6MTg5MzQ1NjAwMCwicm9sZSI6ImFub24iLCJpc3MiOiJzdXBhYmFzZSJ9.QLLj2oEnrtyJHT7mnwP3TZtvkhnEqspaz5VMQDhA1aE';

// State
let questions = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadQuestions();
});

// API Functions
async function fetchQuestions(filter = '') {
    try {
        // Usar ruta relativa. Nginx redirige internamente a Supabase.
        // Ordenar por created_at descendente (más recientes primero)
        let url = `/rest/v1/preguntas?select=*&order=created_at.desc.nullslast`;
        // let url = `${SUPABASE_URL}/rest/v1/preguntas?select=*`;
        if (filter) {
            url += `&estado=eq.${filter}`;
        }

        const response = await fetch(url, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Error fetching questions');
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        showToast('Error al cargar preguntas', 'error');
        return [];
    }
}

async function createQuestion(data) {
    try {
        const response = await fetch(`/rest/v1/preguntas`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error('Error creating question');
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        showToast('Error al crear pregunta', 'error');
        return null;
    }
}

async function updateQuestion(id, data) {
    try {
        const response = await fetch(`/rest/v1/preguntas?id=eq.${id}`, {
            method: 'PATCH',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error('Error updating question');
        return true;
    } catch (error) {
        console.error('Error:', error);
        showToast('Error al actualizar pregunta', 'error');
        return false;
    }
}

async function deleteQuestion(id) {
    try {
        const response = await fetch(`/rest/v1/preguntas?id=eq.${id}`, {
            method: 'DELETE',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Error deleting question');
        return true;
    } catch (error) {
        console.error('Error:', error);
        showToast('Error al eliminar pregunta', 'error');
        return false;
    }
}

// UI Functions
async function loadQuestions() {
    const filter = document.getElementById('filter-estado').value;
    questions = await fetchQuestions(filter);
    renderTable();
    updateStats();
}

function renderTable() {
    const tbody = document.getElementById('questions-tbody');

    if (questions.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="loading-cell">No hay preguntas para mostrar</td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = questions.map(q => `
        <tr data-id="${q.id}">
            <td class="col-obligatory">
                <input type="checkbox" 
                       class="star-checkbox" 
                       ${q.obligatoria ? 'checked' : ''} 
                       onchange="toggleObligatory('${q.id}', this.checked)"
                       title="Marcar como obligatoria">
            </td>
            <td class="col-date">
                <span class="date-badge">${formatDate(q.created_at)}</span>
            </td>
            <td class="col-question">
                <strong>${escapeHtml(q.pregunta.substring(0, 100))}${q.pregunta.length > 100 ? '...' : ''}</strong>
            </td>
            <td class="col-user">
                ${escapeHtml(q.usuario_red_social || '@desconocido')}
            </td>
            <td class="col-topic">
                <span class="topic-badge">${escapeHtml(q.tema || 'Otros')}</span>
            </td>
            <td class="col-status">
                <span class="status-badge ${q.estado === 'usada' ? 'aprobada' : q.estado}">
                    ${q.estado === 'usada' ? 'aprobada' : q.estado}
                </span>
            </td>
            <td class="col-actions">
                ${q.estado === 'pendiente' ? `
                    <button class="action-btn approve" onclick="approveQuestion('${q.id}')" title="Aprobar">
                        ✓
                    </button>
                ` : ''}
                <button class="action-btn edit" onclick="editQuestion('${q.id}')" title="Editar">
                    ✎
                </button>
                <button class="action-btn delete" onclick="confirmDelete('${q.id}')" title="Eliminar">
                    ✕
                </button>
            </td>
        </tr>
    `).join('');
}

function formatDate(dateString) {
    if (!dateString) return 'Sin fecha';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins}m`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;

    return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
}

function updateStats() {
    const total = questions.length;
    const approved = questions.filter(q => q.estado === 'aprobada').length;
    const pending = questions.filter(q => q.estado === 'pendiente').length;
    const obligatory = questions.filter(q => q.obligatoria).length;

    // If we're filtering, fetch all for accurate stats
    fetchQuestions('').then(allQuestions => {
        document.getElementById('stat-total').textContent = allQuestions.length;
        document.getElementById('stat-approved').textContent = allQuestions.filter(q => q.estado === 'aprobada').length;
        document.getElementById('stat-pending').textContent = allQuestions.filter(q => q.estado === 'pendiente').length;
        document.getElementById('stat-obligatory').textContent = allQuestions.filter(q => q.obligatoria).length;
    });
}

// Modal Functions
function showAddModal() {
    document.getElementById('modal-title').textContent = 'Nueva Pregunta';
    document.getElementById('question-form').reset();
    document.getElementById('question-id').value = '';
    document.getElementById('modal-overlay').classList.remove('hidden');
}

function editQuestion(id) {
    const question = questions.find(q => q.id === id);
    if (!question) return;

    document.getElementById('modal-title').textContent = 'Editar Pregunta';
    document.getElementById('question-id').value = id;
    document.getElementById('pregunta').value = question.pregunta;
    document.getElementById('usuario').value = question.usuario_red_social || '';
    document.getElementById('red_social').value = question.red_social || 'X';
    document.getElementById('tema').value = question.tema || 'Otros';
    document.getElementById('estado').value = question.estado || 'pendiente';
    document.getElementById('obligatoria').checked = question.obligatoria || false;

    document.getElementById('modal-overlay').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
}

async function saveQuestion(event) {
    event.preventDefault();

    const id = document.getElementById('question-id').value;
    const data = {
        pregunta: document.getElementById('pregunta').value,
        usuario_red_social: document.getElementById('usuario').value || '@ciudadano',
        red_social: document.getElementById('red_social').value,
        tema: document.getElementById('tema').value,
        estado: document.getElementById('estado').value,
        obligatoria: document.getElementById('obligatoria').checked
    };

    let success;
    if (id) {
        success = await updateQuestion(id, data);
    } else {
        success = await createQuestion(data);
    }

    if (success) {
        showToast(id ? 'Pregunta actualizada' : 'Pregunta creada', 'success');
        closeModal();
        loadQuestions();
    }
}

// Actions
async function toggleObligatory(id, checked) {
    const success = await updateQuestion(id, { obligatoria: checked });
    if (success) {
        showToast(checked ? '⭐ Marcada como obligatoria' : 'Obligatoria removida', 'success');
        updateStats();
    } else {
        loadQuestions(); // Reload to reset checkbox
    }
}

async function approveQuestion(id) {
    const success = await updateQuestion(id, { estado: 'aprobada' });
    if (success) {
        showToast('✓ Pregunta aprobada', 'success');
        loadQuestions();
    }
}

async function confirmDelete(id) {
    if (confirm('¿Estás seguro de que quieres eliminar esta pregunta?')) {
        const success = await deleteQuestion(id);
        if (success) {
            showToast('Pregunta eliminada', 'success');
            loadQuestions();
        }
    }
}

// Utilities
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showToast(message, type = '') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;

    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Close modal on overlay click
document.getElementById('modal-overlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'modal-overlay') {
        closeModal();
    }
});

// ============================================
// CSV UPLOAD FUNCTIONS
// ============================================

let csvData = [];

function showUploadModal() {
    document.getElementById('upload-modal').classList.remove('hidden');
    resetUploadState();
}

function closeUploadModal() {
    document.getElementById('upload-modal').classList.add('hidden');
    resetUploadState();
}

function resetUploadState() {
    csvData = [];
    document.getElementById('csv-file').value = '';
    document.getElementById('file-name').textContent = '';
    document.getElementById('upload-preview').classList.add('hidden');
    document.getElementById('preview-tbody').innerHTML = '';
    document.getElementById('btn-upload').disabled = true;
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    document.getElementById('file-name').textContent = `📄 ${file.name}`;

    const reader = new FileReader();
    reader.onload = function (e) {
        const content = e.target.result;
        parseCSV(content);
    };
    reader.readAsText(file);
}

function parseCSV(content) {
    const lines = content.split('\n').filter(line => line.trim());
    csvData = [];

    // Skip header if it looks like one
    let startIndex = 0;
    const firstLine = lines[0].toLowerCase();
    if (firstLine.includes('pregunta') || firstLine.includes('usuario')) {
        startIndex = 1;
    }

    for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Parse CSV line (handle quoted values)
        const values = parseCSVLine(line);

        if (values.length >= 1 && values[0]) {
            csvData.push({
                pregunta: values[0]?.trim() || '',
                usuario_red_social: values[1]?.trim() || '@ciudadano',
                red_social: values[2]?.trim() || 'X',
                tema: values[3]?.trim() || 'Otros',
                estado: 'pendiente',
                obligatoria: false
            });
        }
    }

    renderPreview();
}

function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current);

    return result.map(v => v.replace(/^"|"$/g, '').trim());
}

function renderPreview() {
    const tbody = document.getElementById('preview-tbody');
    const preview = document.getElementById('upload-preview');
    const count = document.getElementById('preview-count');

    if (csvData.length === 0) {
        preview.classList.add('hidden');
        document.getElementById('btn-upload').disabled = true;
        return;
    }

    count.textContent = csvData.length;
    preview.classList.remove('hidden');
    document.getElementById('btn-upload').disabled = false;

    tbody.innerHTML = csvData.slice(0, 10).map((item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${escapeHtml(item.pregunta.substring(0, 50))}${item.pregunta.length > 50 ? '...' : ''}</td>
            <td>${escapeHtml(item.usuario_red_social)}</td>
            <td>${escapeHtml(item.tema)}</td>
        </tr>
    `).join('');

    if (csvData.length > 10) {
        tbody.innerHTML += `<tr><td colspan="4" style="text-align:center; color: #666;">... y ${csvData.length - 10} más</td></tr>`;
    }
}

async function uploadQuestions() {
    if (csvData.length === 0) return;

    const btn = document.getElementById('btn-upload');
    btn.disabled = true;
    btn.textContent = 'Subiendo...';

    let success = 0;
    let errors = 0;

    for (const item of csvData) {
        const result = await createQuestion(item);
        if (result) {
            success++;
        } else {
            errors++;
        }
    }

    btn.textContent = 'Subir Preguntas';

    if (success > 0) {
        showToast(`✅ ${success} preguntas subidas${errors > 0 ? `, ${errors} errores` : ''}`, 'success');
        closeUploadModal();
        loadQuestions();
    } else {
        showToast('❌ Error al subir preguntas', 'error');
        btn.disabled = false;
    }
}

// Close upload modal on escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeUploadModal();
    }
});

// Close upload modal on overlay click
document.getElementById('upload-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'upload-modal') {
        closeUploadModal();
    }
});
