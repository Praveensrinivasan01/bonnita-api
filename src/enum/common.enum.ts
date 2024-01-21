export enum ENUM_Flag {
    Y = 'Y',
    N = 'N',
}

export enum ENUM_PaymentStatus {
    SUCCESS = 'success',
    PENDING = 'pending',
    Failure = 'failure'
}

export enum ENUM_Query {
    COMPLETED = 'completed',
    PENDING = 'pending',
}

export enum ENUM_Discount {
    PERCENT = 'percentage',
    AMOUNT = 'amount',
}

export enum ENUM_UserStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    CANCELLED = 'cancelled'
}

export enum ENUM_UserRole {
    ADMIN = 'admin',
    USER = 'user',
}

export enum ENUM_PAYMENT_METHOD {
    COD = "CASHONDELIVERY",
    E_PAY = "E_PAY"
}

export enum ENUM_ORDER_STATUS {
    PENDING = "PENDING",
    PACKED = "PACKED",
    READYTOSHIP = "READYTOSHIP",
    ONTHEWAY = "ONTHEWAY",
    DELIVERED = "DELIVERED",
    RETURN = "RETURN",
    REFUNDED = "REFUNDED",
    CANCELLED = "CANCELLED",
    RAISEDAREQUEST = "RAISEDAREQUEST"
}

export enum ENUM_RAISE_REQUEST {
    PENDING = "PENDING",
    REJECTED = "REJECTED",
    APPROVED = "APPROVED"
}

export enum ENUM_COMPLAINT_REASON {
    RETURN = "RETURN",
    REFUND = "REFUND"
}