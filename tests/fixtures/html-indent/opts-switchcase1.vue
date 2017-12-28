<!--{"options":[4,{"switchCase":1}]}-->
<template>
    <div
        v-on:a="
            switch
                (
                    a
                )
            {
                case
                    1
                    :
                    foo;
                case (
                    2
                ):
                    foo;
                case 3:
                    foo;
                case 4:
                {
                    foo;
                }
                default
                    :
                    foo;
            }
        "
        v-on:b="
            switch (a) {
                case 1:
                    foo;
            }
        "
    ></div>
</template>