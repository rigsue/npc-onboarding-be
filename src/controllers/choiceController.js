import {
    createChoice,
    findAllChoices,
    findChoicesByQuesId,
    findChoiceById,
    updateChoiceById,
    updateChoiceStat
} from "../models/choiceModel.js";

export async function makeChoice(req, res, next) {
    try {
        const {
            questionId,
            choiceText,
            isCorrect,
            displayOrder
        } = req.body;

        if (!questionId || !choiceText) {
            const error = new Error(
                "Question ID and choice text are required"
            );
            error.status = 400;
            error.code = "missing_choice_fields";
            throw error;
        }

        const choice = await createChoice(
            questionId,
            choiceText,
            isCorrect,
            displayOrder,
            req.user.userId
        );
        return res.status(201).json({
            message: "Choice created successfully",
            data: choice
        });
    } catch (err) {
        next(err);
    }
}

export async function getAllChoices(_req, res, next) {
    try {
        const choices = await findAllChoices();

        return res.status(200).json({
            message: "Choices retrieved successfully",
            data: choices
        });
    } catch (err) {
        next(err);
    }
}

export async function getChoicesByQues(req, res, next) {
    try {
        const { questionId } = req.params;

        const choices = await findChoicesByQuesId(questionId);

        return res.status(200).json({
            message: "Choices retrieved successfully",
            data: choices
        });
    } catch (err) {
        next(err);
    }
}

export async function getChoiceById(req, res, next) {
    try {
        const { id } = req.params;

        const choice = await findChoiceById(id);

        if (!choice) {
            const error = new Error("Choice not found");
            error.status = 404;
            error.code = "choice_not_found";
            throw error;
        }
        return res.status(200).json({
            message: "Choice retrieved successfully",
            data: choice
        });
    } catch (err) {
        next(err);
    }
}

export async function updateChoice(req, res, next) {
    try {
        const { id } = req.params;

        const {
            choiceText,
            isCorrect,
            displayOrder
        } = req.body;

        if (!isCorrect) {
            const error = new Error(
                "Choice text is required"
            );
            error.status = 400;
            error.code = "missing_choice_text";
            throw error;
        }
        const choice = await updateChoiceById(
            id,
            choiceText,
            isCorrect,
            displayOrder,
            req.user.userId
        );
        if (!choice) {
            const error = new Error("Choice not found");
            error.status = 404;
            error.code = "choice_not_found";
            throw error;
        }

        return res.status(200).json({
            message: "Choice updated successfully",
            data: choice
        });
    } catch (err) {
        next(err);
    }
}

export async function updateChoiceStatus(req, res, next) {
    try {
        const { id } = req.params;
        const { isActive } = req.body;

        if (typeof isActive !== "boolean") {
            const error = new Error(
                "is_active must be a boolean"
            );
            error.status = 400;
            error.code = "invalid_status";
            throw error;
        }
        const choice = await updateChoiceStat(
            id,
            isActive,
            req.user.userId
        );
         if (!choice) {
            const error = new Error("Choice not found");
            error.status = 404;
            error.code = "choice_not_found";
            throw error;
        }
        return res.status(200).json({
            message: "Choice status updated successfully",
            data: choice
        });
    } catch (err) {
        next(err);
    }
}