<template>
  <button class="glitch_button rounded text-white transition-all" :data-glitch="props.label">
    {{ props.label }}
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  label: string;
}>();
</script>

<style scoped>
.glitch_button {
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  position: relative;
  overflow: hidden;
}

.glitch_button:after {
  content: attr(data-glitch);
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 3%, #10b981 3%, #10b981 5%, #059669 5%);
  text-shadow:
    -3px -3px 0px #d1fae5,
    3px 3px 0px #10b981;
  clip-path: inset(50% 50% 50% 50%);
  transition: all 0.3s ease;
}

.glitch_button:hover:after {
  animation: glitch 1s steps(2, end);
}

@keyframes glitch {
  0% {
    clip-path: inset(80% -6px 0 0);
    transform: translate(-20px, -10px);
  }
  10% {
    clip-path: inset(10% -6px 85% 0);
    transform: translate(10px, 10px);
  }
  20% {
    clip-path: inset(80% -6px 0 0);
    transform: translate(-10px, 10px);
  }
  30% {
    clip-path: inset(10% -6px 85% 0);
    transform: translate(0px, 5px);
  }
  40% {
    clip-path: inset(50% -6px 30% 0);
    transform: translate(-5px, 0px);
  }
  50% {
    clip-path: inset(10% -6px 85% 0);
    transform: translate(5px, 0px);
  }
  60% {
    clip-path: inset(40% -6px 43% 0);
    transform: translate(5px, 10px);
  }
  70% {
    clip-path: inset(50% -6px 30% 0);
    transform: translate(-10px, 10px);
  }
  80% {
    clip-path: inset(80% -6px 5% 0);
    transform: translate(20px, -10px);
  }
  90% {
    clip-path: inset(80% -6px 0 0);
    transform: translate(-10px, 0px);
  }
  100% {
    clip-path: inset(50% 50% 50% 50%);
    transform: translate(0);
  }
}
</style>
