<script setup>
defineProps({ employees: { type: Array, required: true } })
const emit = defineEmits(['edit', 'delete'])
</script>

<template>
    <div v-if="!employees.length" class="empty">
        No employees found. Add one above or clear the search filter.
    </div>
    
    <table v-else class="employee-table">
        <thead>
            <tr>
                <th>Employee ID</th><th>Name</th><th>Department</th><th>Position</th>
                <th>Hire Date</th><th>Salary</th><th>Status</th><th>Actions</th>
            </tr>
        </thead>

        <tbody>
            <tr v-for="s in employees" :key="s.id">
                <td><code>{{ s.empId }}</code></td>
                <td>
                    <strong>{{ s.name }}</strong>
                    <div class="muted">{{ s.email }}</div>
                </td>
                <td>{{ s.department }}</td>
                <td>{{ s.position }}</td>
                <td>{{ s.hireDate }}</td>
                <td>RM {{ Number(s.salary).toFixed(2) }}</td>
                <td>
                    <span :class="s.active ? 'badge ok' : 'badge no'">
                        {{ s.active ? 'Active' : 'Inactive' }}
                    </span>
                </td>
                <td>
                    <button @click="emit('edit', s)">Edit</button>
                    <button class="danger" @click="emit('delete', s.id)">Delete</button>
                </td>
            </tr>
        </tbody>
    </table>
</template>