<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
    editingEmployee: { type: Object, default: null }
})
const emit = defineEmits(['save', 'cancel'])

const emptyForm = () => ({
    empId: '', 
    name: '', 
    email: '', 
    department: '', 
    position: '', 
    hireDate: '', 
    salary: '', 
    active: true
})

const form = ref(emptyForm())
const errors = ref({})

watch(() => props.editingEmployee, (val) => {
    form.value = val ? { ...val } : emptyForm()
    errors.value = {}
}, { immediate: true })

const isEditing = computed(() => Boolean(props.editingEmployee))

const empIdRegex = /^EMP[0-9]{3,5}$/
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const today = new Date().toISOString().split('T')[0]
const selectedDate = form.value.hireDate
const selectedSalary = form.value.salary

function validate() {
    const e = {}
    if (!form.value.empId.trim())
        e.empId = 'Employee ID is required.'
    else if (!empIdRegex.test(form.value.empId.trim().toUpperCase()))
        e.empId = 'Format: EMP001 ("EMP" followed with 3 digits).'

    if (!form.value.name.trim() || form.value.name.trim().length < 3)
        e.name = 'Name must be at least 3 characters.'

    if (!emailRegex.test(form.value.email.trim()))
        e.email = 'Please enter a valid email address.'

    if (!form.value.department) {
        e.department = 'Please select a department.'
    }

    if (!form.value.position) {
        e.position = 'Please enter the position.'
    }

    if (!form.value.hireDate) {
        e.hireDate = 'Date is required.'
        console.log('Selected Date:', form.value.hireDate)
    } else if (form.value.hireDate > today) {
        e.hireDate = 'Date cannot be in the future.'
    }

    if (!form.value.salary) {
        e.salary = 'Please enter salary.'
    } else if (form.value.salary < 1500 || form.value.salary > 50000) {
        e.salary = 'Please enter salary within range (RM 1500 - RM 50,000).'
    }

    errors.value = e 
    return Object.keys(e).length === 0
}

function onSubmit() {
    if (!validate()) return
    emit('save', {
        ...form.value,
        empId:      form.value.empId.trim().toUpperCase(),
        name:       form.value.name.trim(),
        email:      form.value.email.trim(),
        department: form.value.department.trim(),
        position:   form.value.position.trim()
    })
    if (!isEditing.value) form.value = emptyForm()
}

function onCancel() {
    emit('cancel')
    form.value = emptyForm()
    errors.value = {}
}
</script>

<template>
    <form @submit.prevent="onSubmit" class="employee-form">
        <h3>{{ isEditing ? 'Edit Employee' : 'Add New Employee' }}</h3>

        <label>Employee ID
            <input v-model.trim="form.empId" placeholder="EMP000" />
            <span v-if="errors.empId" class="err">{{ errors.empId }}</span>
        </label>

        <label>Full Name
            <input v-model.trim="form.name" />
            <span v-if="errors.name" class="err">{{ errors.name }}</span>
        </label>

        <label>Email
            <input v-model.trim="form.email" type="email" />
            <span v-if="errors.email" class="err">{{ errors.email }}</span>
        </label>

        <label>Department
            <select v-model="form.department">
                <option value="">-- Select --</option>
                <option>Human Resources</option>
                <option>Finance</option>
                <option>IT</option>
            </select>
            <span v-if="errors.department" class="err">{{ errors.department }}</span>
        </label>

        <label>Position
            <input v-model.trim="form.position" />
            <span v-if="errors.position" class="err">{{ errors.position }}</span>
        </label>

        <label>Hire Date
            <input v-model.trim="form.hireDate" type="date" />
            <span v-if="errors.hireDate" class="err">{{ errors.hireDate }}</span>
        </label>

        <label>Salary
            <input v-model.number="form.salary" type="number" step="0.01" min="0" />
            <span v-if="errors.salary" class="err">{{ errors.salary }}</span>
        </label>

        <label class="check">
            <input type="checkbox" v-model="form.active" /> Active employee
        </label>

        <div class="actions">
            <button type="submit">{{ isEditing ? 'Update' : 'Add' }}</button>
            <button v-if="isEditing" type="button" @click="onCancel">Cancel</button>
        </div>
    </form>
</template>