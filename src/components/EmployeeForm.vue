<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
    editingEmployees: { type: Object, default: null }
})
const emit = defineEmits(['save', 'cancel'])

const emptyForm = () => ({
    empId: '', name: '', email: '', department: '', 
    position: '', hireDate: '', salary: '', active: true
})

const form = ref(emptyForm())
const errors = ref({})

watch(() => props.editingEmployee, (val) => {
    form.value = val? { ...val } : emptyForm()
    errors.value = {}
}, { immediate: true })

const isEditing = computed(() => Boolean(props.editingEmployee))
const empIdRegex = /^EMP[0-9]{3}$/
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

    if (!selectedDate) {
        e.hireDate = 'Date is required.'
    } else if (selectedDate > today) {
        e.hireDate = 'Date cannot be in the future.'
    }

    if (!selectedSalary) {
        e.salary = 'Please enter salary.'
    } else if (selectedSalary < 1500 && selectedSalary > 50000) {
        e.salary = 'Please enter salary within range (RM 1500 - RM 50,000).'
    }

    errors.value = e 
    return Object.keys(e).length === 0
}

function onSubmit() {
    if (!validate()) return
    emit('save', {
        ...form.value,
        empId:      form.value.empId.trim().toUpperCase,
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
        <h3>{{ isEditing ? 'Edit Student' : 'Add New Student' }}</h3>

        <label>Matric No
            <input v-model.trim="form.empId" placeholder="EMP000" />
            <span v-if="errors.empId" class="err">{{ errors.empId }}</span>
        </label>

        <label>Full Name
            <input v-model.trim="form.name" />
            <span v-if="errors.name" class="err">{{ errors.name }}</span>
        </label>

        <label>Course
        <input v-model.trim="form.course" />
        <span v-if="errors.course" class="err">{{ errors.course }}</span>
        </label>

        <label>Faculty
        <select v-model="form.faculty">
        <option value="">-- Select --</option>
        <option>FSKSM</option>
        <option>FKE</option>
        <option>FAB</option>
        </select>
        <span v-if="errors.faculty" class="err">{{ errors.faculty }}</span>
        </label>

        <label>Email
        <input v-model.trim="form.email" type="email" />
        <span v-if="errors.email" class="err">{{ errors.email }}</span>
        </label>

        <label>GPA
        <input v-model.number="form.gpa" type="number" step="0.01"
        min="0" max="4" />
        <span v-if="errors.gpa" class="err">{{ errors.gpa }}</span>
        </label>

        <label>Year
        <select v-model.number="form.year">
        <option v-for="y in [1,2,3,4,5,6]" :key="y" :value="y">{{ y }}</option>
        </select>
        </label>

        <label class="check">
        <input type="checkbox" v-model="form.active" /> Active student
        </label>

        <div class="actions">
        <button type="submit">{{ isEditing ? 'Update' : 'Add' }}</button>
        <button v-if="isEditing" type="button" @click="onCancel">Cancel</button>
        </div>
    </form>
</template>