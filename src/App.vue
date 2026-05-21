<script setup>
import { ref, onMounted } from 'vue'
import EmployeeForm from './components/EmployeeForm.vue'
import EmployeeList from './components/EmployeeList.vue'
import {
    getEmployees, createEmployee, updateEmployee, deleteEmployee
} from './api/EmployeeApi.js'

const Employees =        ref([])
const editingEmployee =  ref(null)
const loading =         ref(false)
const errorMsg =        ref('')

async function load() {
    loading.value = true
    errorMsg.value = ''
    try {
        const { data } = await getEmployees()
        Employees.value = data
    } catch (e) {
        errorMsg.value = 'Failed to load Employees. Is the API running on :3000?'
    } finally {
        loading.value = false
    }
}

async function handleSave(payload) {
    try {
        if (editingEmployee.value) {
            await updateEmployee(editingEmployee.value.id, payload)
            editingEmployee.value = null
        } else {
            await createEmployee(payload)
        }
        await load()
    } catch (e) {
        errorMsg.value = 'Save failed. Check the console for details.'
    }
}

function handleEdit(s) { editingEmployee.value = { ...s } }
function handleCancel() { editingEmployee.value = null }

async function handleDelete(id) {
    if (!confirm('Delete this Employee? This cannot be undone.')) return
    try {
        await deleteEmployee(id)
        await load()
    } catch {
        errorMsg.value = 'Delete failed.'
    }
}
onMounted(load)
</script>

<template>
    <header>
        <h1>Employee Records Manager</h1>
        <p class="subtitle">Vue 3 · Axios · Express · MySQL</p>
    </header>

    <main>
        <p v-if="loading" class="loading">Loading…</p>
        <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
        
        <EmployeeForm
            :editingEmployee="editingEmployee"
            @save="handleSave"
            @cancel="handleCancel" />

        <EmployeeList
            :Employees="Employees"
            @edit="handleEdit"
            @delete="handleDelete" />
    </main>
</template>