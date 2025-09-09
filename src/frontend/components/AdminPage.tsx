import {
    ErrorMessage,
    Form,
    FormFooter,
    FormHeader,
    FormSection,
    HelperMessage,
    Label,
    LoadingButton,
    RequiredAsterisk,
    Textfield,
    useForm,
    ValidMessage
} from "@forge/react";
import React, {useState} from "react";
import {ForgeGateway} from "../services/ForgeGateway";
import {showToast} from "./Utils";

type FormInputs = {
    token: string;
}

export const AdminPage = () => {
    const {register, getFieldId, handleSubmit, formState: {errors, touchedFields}} = useForm<FormInputs>();
    const [isSubmitting, setSubmitting] = useState(false);

    const onSubmit = async (data: FormInputs): Promise<void> => {
        setSubmitting(true);
        try {
            await new ForgeGateway().saveToken(data.token);
            showToast("success", "Success!", "success", "Token was successfully saved.");
        } catch (e) {
            console.error(e);
            showToast("err", "Error", "error", (e instanceof Error ? e.message : `Unknown error occurred: ${e}`));
        } finally {
            setSubmitting(false);
        }
    };

    const isTokenFieldValid = !errors["token"];
    const isTokenFieldTouched = Boolean(touchedFields["token"]);

    return (
        <>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <FormHeader title="Please enter GitHub token">
                    Required fields are marked with an asterisk <RequiredAsterisk/>
                </FormHeader>
                <FormSection>
                    <Label labelFor={getFieldId("token")}>GitHub token <RequiredAsterisk/></Label>
                    <Textfield placeholder="Paste token here" {...register("token", {
                        required: true,
                        pattern: /^(gh[pousr]_[a-zA-Z0-9]{36,255})$/
                    })} />
                    {isTokenFieldValid ? (
                        isTokenFieldTouched ? (
                            <ValidMessage>Valid token format</ValidMessage>
                        ) : (
                            <HelperMessage>You can use classic tokens or fine-grained ones.</HelperMessage>
                        )
                    ) : (
                        <ErrorMessage>Invalid token format</ErrorMessage>
                    )}
                </FormSection>
                <FormFooter>
                    <LoadingButton appearance="primary" type="submit" isLoading={isSubmitting}>
                        Save
                    </LoadingButton>
                </FormFooter>
            </Form>
        </>
    );
}