import DeviceInfo from "react-native-device-info"

export const deviceInfo = async ()=> {
        const api= await DeviceInfo.getApiLevel()
        const os= await DeviceInfo.getBaseOs()
        const battery= await DeviceInfo.getBatteryLevel()
        const brand= await DeviceInfo.getBrand()
        const buildNumber= await DeviceInfo.getBuildNumber()
        const carrier= await DeviceInfo.getCarrier()
        const device= await DeviceInfo.getDevice()
        const deviceId= await DeviceInfo.getDeviceId()
        const deviceType= await DeviceInfo.getDeviceType()
        const deviceName= await DeviceInfo.getDeviceName()
        const fstInstallTime= await DeviceInfo.getFirstInstallTime()
        const hardware= await DeviceInfo.getHardware()
        const ipAddress= await DeviceInfo.getIpAddress()
        const mac= await DeviceInfo.getMacAddress()
        const manufacture= await DeviceInfo.getManufacturer()
        const model= await DeviceInfo.getModel()
        const product= await DeviceInfo.getProduct()
        const isTablet= await DeviceInfo.isTablet()
        const isEmulator= await DeviceInfo.isEmulator()
        const version= await DeviceInfo.getVersion()
        const userAgent=await DeviceInfo. getUserAgent()
        const memory= await DeviceInfo.getTotalMemory()
        const diskSpace= await DeviceInfo.getTotalDiskCapacity()
        const systemVersion= await DeviceInfo.getSystemVersion()
        const systemName=await DeviceInfo.getSystemName()
        const reableVersion= await DeviceInfo.getReadableVersion()
        const googleMobileServices = await DeviceInfo.hasGms()
        const huaweiMobileServices = await DeviceInfo.hasHms()
        const info = {
            api,
            os,
            battery,
            brand,
            buildNumber,
            carrier,
            device,
            deviceId,
            deviceType,
            deviceName,
            fstInstallTime,
            hardware,
            ipAddress,
            mac,
            manufacture,
            model,
            product,
            isTablet,
            isEmulator,
            version,
            userAgent,
            memory,
            diskSpace,
            systemVersion,
            systemName,
            reableVersion,
            googleMobileServices,
            huaweiMobileServices
        }
        return info
}