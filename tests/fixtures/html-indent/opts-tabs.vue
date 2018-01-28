<!--{"options":["tab"]}-->
<template>
	<div
		v-on:a="
			var aaa = {
				test: 1
			}
			var bbb = {
					test: 1
				},
				ccc = {
					test: 1
				}
			const ddd = {
					test: 1
				},
				eee = (a) => {
					foo(a)
				}
		"
	></div>
</template>