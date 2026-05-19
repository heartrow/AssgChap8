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
</script>