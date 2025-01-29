import { useSession } from "next-auth/react";
import { type FC,useEffect, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import Upload from "~/components/utils/Upload";
import { api } from "~/utils/api";

import SignInWithEthereum from "../Wallet/SignIn";

interface FormInput {
  username: string;
  avatar: string;
}

type Props = {
  onIdentitySet: () => void;
}
export const IdentityForm: FC<Props> = ({ onIdentitySet }) => {
  const { data: session} = useSession();
  const [isMounted, setIsMounted] = useState<boolean>(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { mutateAsync: setIdentity, isPending } = api.identity.setIdentity.useMutation();
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormInput>({
    defaultValues: {
      username: '',
      avatar: '',
    },
  });
  const avatar = watch("avatar");

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    console.log({ data })
    try {
      await setIdentity({
        name: data.username,
        image: data.avatar,
      });
      toast.success("Identity saved");
      onIdentitySet();
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <div className="flex justify-center w-full">
      <form onSubmit={(e) => {
        e.preventDefault();
        void handleSubmit(onSubmit)(e);
      }}>
        <div className="flex flex-col gap-2 w-full min-w-[300px]">
          <div className="form-control">
            <label className="label">
              <span className="label-text text-lg capitalize">Avatar</span>
            </label>
            {!isMounted ? (
              <div className="skeleton h-[200px] w-[200px] mx-auto" />
            ) : (
              <Upload 
                onUpload={({ resolvedUrls }) => {
                  console.log({ resolvedUrls })
                  setValue("avatar", resolvedUrls[0] ?? "");
                }}
                onUploadError={(error) => {
                  toast.error(error.message);
                }}
                initialUrls={[avatar]}
              />
            )}
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-lg capitalize">Username</span>
            </label>
            <input
              {...register("username")}
              type="text"
              className="input input-bordered w-full"
            />
          </div>
          <div className="form-control">
            {session?.user?.address && (
              <button className="btn btn-primary" disabled={isPending}>
                {isPending && <span className="loading loading-spinner loading-sm"></span>}
                {isPending ? "Saving..." : "Save"}
              </button>
            )}
            {!session?.user?.address && (
              <SignInWithEthereum className="btn btn-block btn-primary" />
            )}
          </div>
          {errors.username && (
            <div className="text-error">
              {errors.username.message}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default IdentityForm;