import { Types } from "mongoose";
import {
  ADVERTISEMENT_NOT_FOUND_ERROR,
  END_DATE_VALIDATION_ERROR,
  FIELD_NON_EMPTY_ERROR,
  INPUT_NOT_FOUND_ERROR,
  START_DATE_VALIDATION_ERROR,
  USER_NOT_AUTHORIZED_ERROR,
  USER_NOT_FOUND_ERROR,
} from "../../constants";
import { errors, requestContext } from "../../libraries";
import type {
  InterfaceAdvertisement,
  InterfaceAppUserProfile,
  InterfaceUser,
} from "../../models";
import { Advertisement, AppUserProfile, User } from "../../models";
import { cacheAppUserProfile } from "../../services/AppUserProfileCache/cacheAppUserProfile";
import { findAppUserProfileCache } from "../../services/AppUserProfileCache/findAppUserProfileCache";
import { cacheUsers } from "../../services/UserCache/cacheUser";
import { findUserInCache } from "../../services/UserCache/findUserInCache";
import type { MutationResolvers } from "../../types/generatedGraphQLTypes";
import { uploadEncodedImage } from "../../utilities/encodedImageStorage/uploadEncodedImage";
import { uploadEncodedVideo } from "../../utilities/encodedVideoStorage/uploadEncodedVideo";
<<<<<<< HEAD
/**
 * Updates an advertisement with new details, including handling media file uploads and validating input fields.
 *
 * This function updates an existing advertisement based on the provided input. It checks for required fields, validates dates, handles media file uploads, and performs authorization checks to ensure that the current user has the right to update the advertisement. The function returns the updated advertisement after applying changes.
 *
 * @param _parent - This parameter represents the parent resolver in the GraphQL schema and is not used in this function.
 * @param args - The arguments passed to the GraphQL mutation, including the advertisement's `_id` and other fields to update. This may include `startDate`, `endDate`, and `mediaFile`.
 * @param context - Provides contextual information, including the current user's ID. This is used to authenticate and authorize the request.
 *
 * @returns An object containing the updated advertisement with all its fields.
 *
 */
=======

>>>>>>> main
export const updateAdvertisement: MutationResolvers["updateAdvertisement"] =
  async (_parent, args, context) => {
    const { _id, ...otherFields } = args.input;

<<<<<<< HEAD
    // Check if input is provided
=======
    //If there is no input
>>>>>>> main
    if (Object.keys(otherFields).length === 0) {
      throw new errors.InputValidationError(
        requestContext.translate(INPUT_NOT_FOUND_ERROR.MESSAGE),
        INPUT_NOT_FOUND_ERROR.CODE,
        INPUT_NOT_FOUND_ERROR.PARAM,
      );
    }

<<<<<<< HEAD
    // Check for unintended null values in permitted fields
=======
    // Check for unintended null values in permitted fields, if all fields are permitted
>>>>>>> main
    for (const fieldValue of Object.values(args.input)) {
      if (
        fieldValue === null ||
        (typeof fieldValue === "string" && fieldValue.trim() === "")
      ) {
        throw new errors.InputValidationError(
          requestContext.translate(FIELD_NON_EMPTY_ERROR.MESSAGE),
          FIELD_NON_EMPTY_ERROR.CODE,
          FIELD_NON_EMPTY_ERROR.PARAM,
        );
      }
    }

<<<<<<< HEAD
    // Retrieve the current user from cache or database
=======
>>>>>>> main
    let currentUser: InterfaceUser | null;
    const userFoundInCache = await findUserInCache([context.userId]);
    currentUser = userFoundInCache[0];
    if (currentUser === null) {
      currentUser = await User.findOne({
        _id: context.userId,
      }).lean();
      if (currentUser !== null) {
        await cacheUsers([currentUser]);
      }
    }

<<<<<<< HEAD
    // Check if the current user exists
=======
>>>>>>> main
    if (!currentUser) {
      throw new errors.NotFoundError(
        requestContext.translate(USER_NOT_FOUND_ERROR.MESSAGE),
        USER_NOT_FOUND_ERROR.CODE,
        USER_NOT_FOUND_ERROR.PARAM,
      );
    }

<<<<<<< HEAD
    // Retrieve the current user's app profile from cache or database
=======
>>>>>>> main
    let currentUserAppProfile: InterfaceAppUserProfile | null;
    const appUserProfileFoundInCache = await findAppUserProfileCache([
      currentUser.appUserProfileId?.toString(),
    ]);
    currentUserAppProfile = appUserProfileFoundInCache[0];
    if (currentUserAppProfile === null) {
      currentUserAppProfile = await AppUserProfile.findOne({
        userId: currentUser._id,
      }).lean();
      if (currentUserAppProfile !== null) {
        await cacheAppUserProfile([currentUserAppProfile]);
      }
    }
<<<<<<< HEAD

    // Check if the user's app profile exists
=======
>>>>>>> main
    if (!currentUserAppProfile) {
      throw new errors.UnauthorizedError(
        requestContext.translate(USER_NOT_AUTHORIZED_ERROR.MESSAGE),
        USER_NOT_AUTHORIZED_ERROR.CODE,
        USER_NOT_AUTHORIZED_ERROR.PARAM,
      );
    }
<<<<<<< HEAD

    // Retrieve the advertisement from the database
=======
>>>>>>> main
    const advertisement = await Advertisement.findOne({
      _id: _id,
    });
    if (!advertisement) {
      throw new errors.NotFoundError(
        requestContext.translate(ADVERTISEMENT_NOT_FOUND_ERROR.MESSAGE),
        ADVERTISEMENT_NOT_FOUND_ERROR.CODE,
        ADVERTISEMENT_NOT_FOUND_ERROR.PARAM,
      );
    }

<<<<<<< HEAD
    // Check if the user is authorized to update the advertisement
=======
>>>>>>> main
    const userIsOrganizationAdmin = currentUserAppProfile.adminFor.some(
      (organisation) =>
        organisation === advertisement.organizationId ||
        new Types.ObjectId(organisation?.toString()).equals(
          advertisement.organizationId,
        ),
    );
    if (!userIsOrganizationAdmin && !currentUserAppProfile.isSuperAdmin) {
      throw new errors.UnauthorizedError(
        requestContext.translate(USER_NOT_AUTHORIZED_ERROR.MESSAGE),
        USER_NOT_AUTHORIZED_ERROR.CODE,
        USER_NOT_AUTHORIZED_ERROR.PARAM,
      );
    }

    const { startDate, endDate } = args.input;

<<<<<<< HEAD
    // Validate startDate and endDate
=======
    //If startDate is less than or equal to current date
>>>>>>> main
    if (
      startDate &&
      new Date(startDate) <= new Date(new Date().toDateString())
    ) {
      throw new errors.InputValidationError(
        requestContext.translate(START_DATE_VALIDATION_ERROR.MESSAGE),
        START_DATE_VALIDATION_ERROR.CODE,
        START_DATE_VALIDATION_ERROR.PARAM,
      );
    }

    //If endDate is less than or equal to startDate
    if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
      throw new errors.InputValidationError(
        requestContext.translate(END_DATE_VALIDATION_ERROR.MESSAGE),
        END_DATE_VALIDATION_ERROR.CODE,
        END_DATE_VALIDATION_ERROR.PARAM,
      );
    }

    let uploadMediaFile = null;

<<<<<<< HEAD
    // Handle media file upload
=======
>>>>>>> main
    if (args.input.mediaFile) {
      const dataUrlPrefix = "data:";
      if (args.input.mediaFile.startsWith(dataUrlPrefix + "image/")) {
        uploadMediaFile = await uploadEncodedImage(args.input.mediaFile, null);
      } else if (args.input.mediaFile.startsWith(dataUrlPrefix + "video/")) {
        uploadMediaFile = await uploadEncodedVideo(args.input.mediaFile, null);
      } else {
        throw new Error("Unsupported file type.");
      }
    }

<<<<<<< HEAD
    // Prepare fields to update
=======
>>>>>>> main
    const fieldsToUpdate = args.input.mediaFile
      ? { ...args.input, mediaUrl: uploadMediaFile }
      : { ...args.input };

<<<<<<< HEAD
    // Update the advertisement in the database
=======
>>>>>>> main
    const updatedAdvertisement = await Advertisement.findOneAndUpdate(
      {
        _id: _id,
      },
      {
        $set: fieldsToUpdate,
      },
      {
        new: true,
      },
    ).lean();

<<<<<<< HEAD
    // Prepare and return the updated advertisement payload
=======
>>>>>>> main
    const updatedAdvertisementPayload = {
      _id: updatedAdvertisement?._id?.toString(), // Ensure _id is converted to String as per GraphQL schema
      name: updatedAdvertisement?.name,
      organizationId: updatedAdvertisement?.organizationId,
      mediaUrl: updatedAdvertisement?.mediaUrl,
      type: updatedAdvertisement?.type,
      startDate: updatedAdvertisement?.startDate,
      endDate: updatedAdvertisement?.endDate,
      createdAt: updatedAdvertisement?.createdAt,
      updatedAt: updatedAdvertisement?.updatedAt,
      creatorId: updatedAdvertisement?.creatorId,
    };
    return {
      advertisement: {
        ...updatedAdvertisementPayload,
      } as InterfaceAdvertisement,
    };
  };
