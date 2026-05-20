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
        
    })
}
</script>