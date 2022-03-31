<!-- a[href*="insensitive"] -->
<template>
  <!-- Test for not insensitive -->
  <ul>
    <li><a href="#internal">Internal link</a></li>
    <li><a href="http://example.com">Example link</a></li>
    <li><a href="#InSensitive">Insensitive internal link</a></li>
    <li><a href="http://example.org">Example org link</a></li>
    <li><a href="https://example.org">Example https org link</a></li>
  </ul>
</template>
