# 项目目录结构 (doc 文件夹)
*此文件由 'npm run gen:tree' 自动生成，用于为 Agent 提供上下文。*

```
doc
doc
├── cpoms.sql
├── mars_admin.sql
├── mybatis-flex.config
├── pom.xml
├── project-tree.md
└── src
    └── main
        ├── java
        │   └── com
        │       └── eclipse
        │           └── admin
        │               ├── CPOMSApplication.java
        │               ├── common
        │               │   ├── enums
        │               │   │   ├── EnableEnum.java
        │               │   │   ├── FileUploadType.java
        │               │   │   └── LoginType.java
        │               │   ├── request
        │               │   │   ├── ChangePasswordRequest.java
        │               │   │   ├── LoginRequest.java
        │               │   │   └── UpdateProfileRequest.java
        │               │   ├── response
        │               │   │   ├── FilePreviewInfo.java
        │               │   │   ├── FileUploadResult.java
        │               │   │   └── LoginResponse.java
        │               │   └── vo
        │               │       └── monitor
        │               │           ├── ClassLoaderInfoVO.java
        │               │           ├── CpuInfoVO.java
        │               │           ├── DiskInfoVO.java
        │               │           ├── GcInfoVO.java
        │               │           ├── HealthCheckVO.java
        │               │           ├── JvmInfoVO.java
        │               │           ├── MemoryInfoVO.java
        │               │           ├── NetworkInfoVO.java
        │               │           ├── ServerInfoVO.java
        │               │           ├── SysMonitorVO.java
        │               │           ├── SystemLoadVO.java
        │               │           └── ThreadInfoVO.java
        │               ├── framework
        │               │   ├── anno
        │               │   │   ├── AdminStarter.java
        │               │   │   └── Main.java
        │               │   ├── aspect
        │               │   │   └── OperationLogAspect.java
        │               │   ├── common
        │               │   │   ├── Result.java
        │               │   │   ├── ResultCode.java
        │               │   │   └── annotation
        │               │   │       └── OperationLog.java
        │               │   ├── config
        │               │   │   ├── ApiDocConfig.java
        │               │   │   ├── AspectConfig.java
        │               │   │   ├── AsyncConfig.java
        │               │   │   ├── CorsConfiguration.java
        │               │   │   ├── MyBatisFlexConfiguration.java
        │               │   │   ├── OpenApiConfig.java
        │               │   │   ├── OssConfig.java
        │               │   │   ├── OssConfigLoader.java
        │               │   │   ├── RedisConfig.java
        │               │   │   ├── SaTokenConfiguration.java
        │               │   │   ├── SaTokenProperties.java
        │               │   │   ├── SqlLogProperties.java
        │               │   │   ├── StpInterfaceImpl.java
        │               │   │   └── WebMvcConfig.java
        │               │   ├── context
        │               │   │   └── UserContext.java
        │               │   ├── enums
        │               │   │   └── BusinessType.java
        │               │   ├── exception
        │               │   │   ├── BusinessException.java
        │               │   │   └── GlobalExceptionHandler.java
        │               │   ├── interceptor
        │               │   │   └── ProductionReadOnlyInterceptor.java
        │               │   ├── listener
        │               │   │   ├── EntityChangeListener.java
        │               │   │   └── EntityLogicDeleteListener.java
        │               │   ├── oss
        │               │   │   ├── factory
        │               │   │   │   └── FileUploadStrategyFactory.java
        │               │   │   └── strategy
        │               │   │       ├── FileUploadStrategy.java
        │               │   │       └── impl
        │               │   │           ├── AliyunOssFileUploadStrategy.java
        │               │   │           ├── LocalFileUploadStrategy.java
        │               │   │           └── MinioFileUploadStrategy.java
        │               │   ├── runner
        │               │   │   ├── StartupInfoRunner.java
        │               │   │   └── SystemInfoRunner.java
        │               │   ├── service
        │               │   │   └── AsyncOperationLogService.java
        │               │   ├── strategy
        │               │   │   ├── LoginStrategy.java
        │               │   │   ├── LoginStrategyFactory.java
        │               │   │   └── impl
        │               │   │       ├── AppLoginStrategy.java
        │               │   │       ├── MiniProgramLoginStrategy.java
        │               │   │       └── PcLoginStrategy.java
        │               │   └── util
        │               │       ├── ExcelUtils.java
        │               │       ├── FileUtils.java
        │               │       ├── IpUtils.java
        │               │       ├── SqlCopyUtil.java
        │               │       ├── SqlLogUtil.java
        │               │       └── UserAgentUtils.java
        │               └── modules
        │                   ├── app
        │                   │   └── UserController.java
        │                   ├── auth
        │                   │   └── AuthController.java
        │                   ├── base
        │                   │   ├── controller
        │                   │   │   ├── ApiDocController.java
        │                   │   │   ├── BaseController.java
        │                   │   │   ├── CacheMonitorController.java
        │                   │   │   ├── FileDownloadController.java
        │                   │   │   ├── FileUploadController.java
        │                   │   │   ├── LocalFileController.java
        │                   │   │   ├── RouteController.java
        │                   │   │   ├── SqlLogController.java
        │                   │   │   └── SqlLogPageController.java
        │                   │   ├── entity
        │                   │   │   └── BaseEntity.java
        │                   │   ├── mapper
        │                   │   │   └── BasePlusMapper.java
        │                   │   ├── request
        │                   │   │   └── BaseRequest.java
        │                   │   └── service
        │                   │       ├── BaseService.java
        │                   │       └── impl
        │                   │           └── BaseServiceImpl.java
        │                   ├── biz
        │                   │   ├── controller
        │                   │   │   └── BizProductController.java
        │                   │   ├── entity
        │                   │   │   └── BizProduct.java
        │                   │   ├── mapper
        │                   │   │   └── BizProductMapper.java
        │                   │   ├── service
        │                   │   │   ├── IBizProductService.java
        │                   │   │   └── impl
        │                   │   │       └── BizProductServiceImpl.java
        │                   │   └── vo
        │                   │       └── ProductStatsVO.java
        │                   ├── crm
        │                   │   ├── controller
        │                   │   │   ├── CrmCustomerCompanyController.java
        │                   │   │   └── CrmCustomerController.java
        │                   │   ├── entity
        │                   │   │   ├── CrmCustomer.java
        │                   │   │   └── CrmCustomerCompany.java
        │                   │   ├── mapper
        │                   │   │   ├── CrmCustomerCompanyMapper.java
        │                   │   │   └── CrmCustomerMapper.java
        │                   │   ├── req
        │                   │   │   ├── CustomerCompanyInsertReq.java
        │                   │   │   ├── CustomerInsertReq.java
        │                   │   │   └── CustomerTransStatsReq.java
        │                   │   ├── service
        │                   │   │   ├── ICrmCustomerCompanyService.java
        │                   │   │   ├── ICrmCustomerService.java
        │                   │   │   └── impl
        │                   │   │       ├── CrmCustomerCompanyServiceImpl.java
        │                   │   │       └── CrmCustomerServiceImpl.java
        │                   │   └── vo
        │                   │       └── CustomerDetailVO.java
        │                   ├── system
        │                   │   ├── controller
        │                   │   │   ├── SysConfigController.java
        │                   │   │   ├── SysDeptController.java
        │                   │   │   ├── SysDictCacheController.java
        │                   │   │   ├── SysDictController.java
        │                   │   │   ├── SysLoginInfoController.java
        │                   │   │   ├── SysMenuController.java
        │                   │   │   ├── SysMonitorController.java
        │                   │   │   ├── SysOperLogController.java
        │                   │   │   ├── SysOssConfigController.java
        │                   │   │   ├── SysPostController.java
        │                   │   │   ├── SysRoleController.java
        │                   │   │   └── SysUserController.java
        │                   │   ├── entity
        │                   │   │   ├── SysConfig.java
        │                   │   │   ├── SysDept.java
        │                   │   │   ├── SysDictData.java
        │                   │   │   ├── SysDictType.java
        │                   │   │   ├── SysLoginInfo.java
        │                   │   │   ├── SysMenu.java
        │                   │   │   ├── SysOperLog.java
        │                   │   │   ├── SysOss.java
        │                   │   │   ├── SysOssConfig.java
        │                   │   │   ├── SysPost.java
        │                   │   │   ├── SysRole.java
        │                   │   │   ├── SysRoleDept.java
        │                   │   │   ├── SysRoleMenu.java
        │                   │   │   ├── SysUser.java
        │                   │   │   ├── SysUserDept.java
        │                   │   │   ├── SysUserPost.java
        │                   │   │   ├── SysUserRole.java
        │                   │   │   └── User.java
        │                   │   ├── mapper
        │                   │   │   ├── SysConfigMapper.java
        │                   │   │   ├── SysDeptMapper.java
        │                   │   │   ├── SysDictDataMapper.java
        │                   │   │   ├── SysDictTypeMapper.java
        │                   │   │   ├── SysLoginInfoMapper.java
        │                   │   │   ├── SysMenuMapper.java
        │                   │   │   ├── SysOperLogMapper.java
        │                   │   │   ├── SysOssConfigMapper.java
        │                   │   │   ├── SysOssMapper.java
        │                   │   │   ├── SysPostMapper.java
        │                   │   │   ├── SysRoleDeptMapper.java
        │                   │   │   ├── SysRoleMapper.java
        │                   │   │   ├── SysRoleMenuMapper.java
        │                   │   │   ├── SysUserDeptMapper.java
        │                   │   │   ├── SysUserMapper.java
        │                   │   │   ├── SysUserPostMapper.java
        │                   │   │   ├── SysUserRoleMapper.java
        │                   │   │   └── UserMapper.java
        │                   │   └── service
        │                   │       ├── IAuthService.java
        │                   │       ├── IFileDownloadService.java
        │                   │       ├── IFileUploadService.java
        │                   │       ├── ISysConfigService.java
        │                   │       ├── ISysDeptService.java
        │                   │       ├── ISysDictDataService.java
        │                   │       ├── ISysDictTypeService.java
        │                   │       ├── ISysLoginInfoService.java
        │                   │       ├── ISysMenuService.java
        │                   │       ├── ISysMonitorService.java
        │                   │       ├── ISysOperLogService.java
        │                   │       ├── ISysOssConfigService.java
        │                   │       ├── ISysPostService.java
        │                   │       ├── ISysRoleService.java
        │                   │       ├── ISysUserService.java
        │                   │       ├── IUserService.java
        │                   │       └── impl
        │                   │           ├── AuthServiceImpl.java
        │                   │           ├── FileDownloadServiceImpl.java
        │                   │           ├── FileUploadServiceImpl.java
        │                   │           ├── SysConfigServiceImpl.java
        │                   │           ├── SysDeptServiceImpl.java
        │                   │           ├── SysDictDataServiceImpl.java
        │                   │           ├── SysDictTypeServiceImpl.java
        │                   │           ├── SysLoginInfoServiceImpl.java
        │                   │           ├── SysMenuServiceImpl.java
        │                   │           ├── SysMonitorServiceImpl.java
        │                   │           ├── SysOperLogServiceImpl.java
        │                   │           ├── SysOssConfigServiceImpl.java
        │                   │           ├── SysPostServiceImpl.java
        │                   │           ├── SysRoleServiceImpl.java
        │                   │           ├── SysUserServiceImpl.java
        │                   │           └── UserServiceImpl.java
        │                   └── wms
        │                       ├── controller
        │                       │   └── WmsMaterialController.java
        │                       ├── entity
        │                       │   └── WmsMaterial.java
        │                       ├── enums
        │                       │   └── MaterialCategoryEnum.java
        │                       ├── mapper
        │                       │   └── WmsMaterialMapper.java
        │                       ├── req
        │                       │   └── MaterialInsertReq.java
        │                       ├── service
        │                       │   ├── IWmsMaterialService.java
        │                       │   ├── MaterialCodeGenerator.java
        │                       │   └── impl
        │                       │       ├── DefaultMaterialCodeGenerator.java
        │                       │       └── WmsMaterialServiceImpl.java
        │                       └── vo
        │                           └── MaterialInsertVO.java
        └── resources
            ├── application-dev.yml
            ├── application-prod.yml
            ├── application.yml
            ├── mapper
            │   ├── README.md
            │   ├── SysConfigMapper.xml
            │   ├── SysDeptMapper.xml
            │   ├── SysDictDataMapper.xml
            │   ├── SysDictTypeMapper.xml
            │   ├── SysLoginInfoMapper.xml
            │   ├── SysMenuMapper.xml
            │   ├── SysOperLogMapper.xml
            │   ├── SysPostMapper.xml
            │   ├── SysRoleMapper.xml
            │   └── SysUserMapper.xml
            └── static
                └── sqlLog.html

```