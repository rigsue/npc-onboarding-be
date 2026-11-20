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
        const { choiceId } = req.params;

        const choice = await findChoiceById(choiceId);

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

        if (
            typeof choiceText !== "string" ||
            !choiceText.trim() ||
            typeof isCorrect !== "boolean" ||
            !Number.isSafeInteger(Number(displayOrder)) ||
            Number(displayOrder) < 1
        ) {
            return res.status(400).json({
                message: "Invalid choice fields"
            });
        }
        const choice = await updateChoiceById(
            id,
            choiceText.trim(),
            isCorrect,
            Number(displayOrder),
            req.user.userId
        );

        if (!choice) {
            return res.status(404).json({
                message: "Choice not found"
            });
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
        const updatedBy = req.user.userId;

        if (typeof isActive !== "boolean") {
            const error = new Error("is_active must be a boolean");
            error.status = 400;
            error.code = "invalid_status";
            throw error;
        }

        const choice = await updateChoiceStat(
            id,
            isActive,
            updatedBy
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