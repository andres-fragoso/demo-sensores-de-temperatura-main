<!-- eslint-disable vue/no-dupe-keys -->
<template>
  <q-dialog
    ref="dialogRef"
    :no-backdrop-dismiss="noBackdropDismiss"
    @hide="onDialogHide"
  >
    <component
      :is="formularioComponent"
      :propsCustomForm="formularioComponentProps"
      @onDialogCancel="onDialogCancel"
    ></component>
  </q-dialog>
</template>

<script>
import { defineComponent } from "vue";
import { useDialogPluginComponent } from "quasar";

export default defineComponent({
  name: "CustomFormDialog",
  props: {
    formularioComponentProps: {
      type: Object,
      default: null,
    },
    loadingColor: {
      type: String,
      default: "secondary",
    },
    formularioComponent: {
      required: true,
      type: Object,
    },
    noBackdropDismiss: {
      type: Boolean,
      default: true,
    },
  },
  emits: [...useDialogPluginComponent.emits],
  setup(props) {
    const { formularioComponent, formularioComponentProps, noBackdropDismiss } =
      props;

    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();

    return {
      dialogRef,
      // eslint-disable-next-line vue/no-dupe-keys
      formularioComponent,
      // eslint-disable-next-line vue/no-dupe-keys
      formularioComponentProps,
      onDialogHide,
      onDialogOK,
      onDialogCancel,
      // eslint-disable-next-line vue/no-dupe-keys
      noBackdropDismiss,
    };
  },
});
</script>
