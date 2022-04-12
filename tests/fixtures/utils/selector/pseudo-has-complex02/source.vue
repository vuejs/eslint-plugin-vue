<!-- div:has(>.foo .foo) -->
<template>
  <div class="foo" id="root-1">
    <div class="foo nest-1">
      <div class="foo nest-2">
        <div class="foo nest-3">
        </div>
      </div>
    </div>
  </div>
  <div class="foo" id="root-2">
    <div class="bar nest-1">
      <div class="foo nest-2">
        <div class="bar nest-3">
        </div>
      </div>
    </div>
  </div>
  <div class="foo" id="root-3">
    <div class="foo nest-1">
      <div class="bar nest-2">
        <div class="foo nest-3">
        </div>
      </div>
    </div>
  </div>
  <div class="foo" id="root-4">
    <div class="foo nest-1">
    </div>
  </div>
</template>
