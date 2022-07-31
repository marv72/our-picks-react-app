import React from 'react';

import { Link as RouterLink } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';

// material-ui
import {
    Button,
    Checkbox,
    Divider,
    FormControlLabel,
    FormHelperText,
    Grid,
    Link,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Stack,
    Typography
} from '@mui/material';

// third party
import { Formik } from 'formik';
import AnimateButton from 'components/@extended/AnimateButton';

/*
 GraphQL Mutation to update a pick with the username 
*/
const MAKE_PICK = gql`
    mutation Mutation($id: ID!, $name: String!, $username: String!) {
        makePick(id: $id, name: $name, username: $username) {
            success
            message
        }
    }
`;

const MakePick = (pick) => {
    console.log(pick.name);

    const [makePick, { data, loading }] = useMutation(MAKE_PICK);
    return (
        <>
            <Formik
                initialValues={{
                    pick: pick.name,
                    submit: null
                }}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        makePick({ variables: { name: pick.name, username: pick.username, id: pick.id } });
                        console.log('data: ', data);
                        setStatus({ success: false });
                        setSubmitting(false);
                    } catch (err) {
                        setStatus({ success: false });
                        setErrors({ submit: err.message });
                        setSubmitting(false);
                    }
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <OutlinedInput
                                        id="my-pick"
                                        type="text"
                                        value={values.pick}
                                        name="pick"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="Enter your pick"
                                        fullWidth
                                        disabled
                                        error={Boolean(touched.pick && errors.pick)}
                                    />
                                    {touched.pick && errors.pick && (
                                        <FormHelperText error id="standard-weight-helper-text-my-pick">
                                            {errors.pick}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>

                            <Grid item xs={12}>
                                <AnimateButton>
                                    <Button
                                        disableElevation
                                        disabled={isSubmitting}
                                        fullWidth
                                        size="large"
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                    >
                                        Make Pick
                                    </Button>
                                </AnimateButton>
                            </Grid>
                        </Grid>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default MakePick;
